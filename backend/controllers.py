import io
import pandas as pd
import xmltodict
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Depends
from models import JSONIngestRequest, UserCreate, Token
from database import engine
from auth import get_current_user, get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import sqlalchemy as sa
from sqlalchemy.sql import text

router = APIRouter()

@router.post("/auth/register")
async def register(user: UserCreate):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id FROM users WHERE username = :username"), {"username": user.username}).fetchone()
        if result:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        hashed_password = get_password_hash(user.password)
        conn.execute(
            text("INSERT INTO users (name, username, password_hash) VALUES (:name, :username, :password_hash)"),
            {"name": user.name, "username": user.username, "password_hash": hashed_password}
        )
        conn.commit()
    return {"message": "User registered successfully"}

@router.post("/auth/login", response_model=Token)
async def login(user: UserCreate):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, username, password_hash FROM users WHERE username = :username"), {"username": user.username}).fetchone()
        
        if not result or not verify_password(user.password, result[2]):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
            
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": result[1]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

@router.post("/ingest/json")
async def ingest_json(request: JSONIngestRequest, current_user: str = Depends(get_current_user)):
    # remaining code unchanged...
    records = []
    for order in request.orders:
        for item in order.items:
            records.append({
                "order_id": str(order.order_id),
                "customer_id": order.customer.id,
                "customer_name": order.customer.name,
                "order_date": order.order_date,
                "product_id": item.product_id,
                "qty": item.qty,
                "price": item.price
            })
    if records:
        df_new = pd.DataFrame(records)
        df_new.to_sql("orders", engine, if_exists="append", index=False, method="multi", chunksize=1000)
    return {"message": "JSON data ingested successfully into SQL DB", "records_inserted": len(records)}

@router.post("/ingest/xml")
async def ingest_xml(request: Request):
    try:
        body = await request.body()
        data = xmltodict.parse(body)
        shipments = data.get("shipments", {}).get("shipment", [])
        if not isinstance(shipments, list):
            shipments = [shipments]
        records = []
        for s in shipments:
            try:
                delivery_days = int(str(s.get("delivery_days", "0")).strip())
            except ValueError:
                delivery_days = 0
            records.append({
                "shipment_id": str(s.get("shipment_id", "")).strip(),
                "order_id": str(s.get("order_id", "")).strip(),
                "delivery_days": delivery_days,
                "status": str(s.get("status", "")).strip()
            })
        if records:
            df_new = pd.DataFrame(records)
            df_new.to_sql("shipments", engine, if_exists="append", index=False, method="multi", chunksize=1000)
        return {"message": "XML data ingested successfully into SQL DB", "records_inserted": len(records)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing XML: {str(e)}")

@router.post("/ingest/csv")
async def ingest_csv(file: UploadFile = File(...)):
    try:
        content = await file.read()
        df_new = pd.read_csv(io.BytesIO(content))
        expected_cols = ["ProductID", "ProductName", "Category"]
        for col in expected_cols:
            if col not in df_new.columns:
                raise ValueError(f"Missing required column: {col}")
        df_new = df_new.dropna(subset=expected_cols)
        df_new.to_sql("products", engine, if_exists="append", index=False)
        return {"message": "CSV data ingested successfully into SQL DB", "records_inserted": len(df_new)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

async def get_exchange_rate(base: str = "USD", target: str = "USD") -> float:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://open.er-api.com/v6/latest/{base}")
            if resp.status_code == 200:
                data = resp.json()
                return data.get("rates", {}).get(target, 1.0)
    except Exception:
        pass
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get("https://restcountries.com/v3.1/all")
    except Exception:
        pass
    return 1.0

@router.get("/analytics/summary")
async def get_analytics_summary(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    category: Optional[str] = None,
    deliveryStatus: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
    current_user: str = Depends(get_current_user)
):
    df_orders = pd.read_sql("SELECT * FROM orders", engine)
    df_shipments = pd.read_sql("SELECT * FROM shipments", engine)
    df_products = pd.read_sql("SELECT * FROM products", engine)
    
    if df_orders.empty:
        return {
            "summary": {"Total Orders": 0, "Total Revenue": 0, "Total Delayed Orders": 0, "Average Delivery Days": 0},
            "revenueTrend": [],
            "categoryBreakdown": [],
            "fulfillmentMetrics": []
        }
        
    df_orders = df_orders.drop_duplicates()
    df_shipments = df_shipments.drop_duplicates()
    df_products = df_products.drop_duplicates()
        
    df = pd.merge(df_orders, df_products, left_on="product_id", right_on="ProductID", how="left")
    df = pd.merge(df, df_shipments, on="order_id", how="left")
    
    df["qty"] = pd.to_numeric(df["qty"], errors="coerce").fillna(0)
    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0)
    df["item_total"] = df["qty"] * df["price"]
    df["delivery_days"] = pd.to_numeric(df["delivery_days"], errors="coerce").fillna(0)
    df["status"] = df["status"].fillna("Unknown")
    df["is_delayed"] = df.apply(lambda row: True if row["status"] == "Delayed" or row["delivery_days"] > 5 else False, axis=1)
    df["order_date_dt"] = pd.to_datetime(df["order_date"], errors="coerce")
    
    if startDate:
        df = df[df["order_date_dt"] >= pd.to_datetime(startDate)]
    if endDate:
        df = df[df["order_date_dt"] <= pd.to_datetime(endDate)]
    if category and category != "All":
        df = df[df["Category"] == category]
    if deliveryStatus and deliveryStatus != "All":
        if deliveryStatus == "Delayed":
            df = df[df["is_delayed"] == True]
        elif deliveryStatus == "Delivered":
            df = df[df["status"] == "Delivered"]
    
    if df.empty:
        return {
            "summary": {"Total Orders": 0, "Total Revenue": 0, "Total Delayed Orders": 0, "Average Delivery Days": 0},
            "revenueTrend": [],
            "categoryBreakdown": [],
            "fulfillmentMetrics": []
        }
        
    fx_rate = await get_exchange_rate("USD", "USD")
    
    order_groups = df.groupby("order_id")
    unique_orders_count = len(order_groups)
    
    total_revenue = float(df["item_total"].sum() * fx_rate)
    total_delayed = int(order_groups["is_delayed"].max().sum())
    
    avg_delivery_days = float(df.drop_duplicates(subset=["order_id"])["delivery_days"].mean())
    if pd.isna(avg_delivery_days):
        avg_delivery_days = 0.0
        
    summary = {
        "Total Orders": unique_orders_count,
        "Total Revenue": round(total_revenue, 2),
        "Total Delayed Orders": total_delayed,
        "Average Delivery Days": round(avg_delivery_days, 1),
        "Delivery Success Rate": f"{round(((unique_orders_count - total_delayed) / unique_orders_count) * 100, 1)}%" if unique_orders_count > 0 else "0%"
    }
    
    trend_df = df.groupby("order_date").agg(revenue=("item_total", "sum"), orders_count=("order_id", "nunique")).reset_index()
    trend_df["revenue"] = trend_df["revenue"] * fx_rate
    revenueTrend = trend_df.to_dict(orient="records")
    
    cat_df = df.groupby("Category").agg(revenue=("item_total", "sum"), qty=("qty", "sum")).reset_index()
    cat_df["revenue"] = cat_df["revenue"] * fx_rate
    categoryBreakdown = cat_df.to_dict(orient="records")
    
    fulfillment_df = df.drop_duplicates(subset=["order_id"])
    status_counts = fulfillment_df["status"].value_counts().reset_index()
    status_counts.columns = ["status", "count"]
    total_status = status_counts["count"].sum()
    status_counts["percentage"] = (status_counts["count"] / total_status * 100).round(1)
    fulfillmentMetrics = status_counts.to_dict(orient="records")
    
    return {
        "summary": summary,
        "revenueTrend": revenueTrend,
        "categoryBreakdown": categoryBreakdown,
        "fulfillmentMetrics": fulfillmentMetrics,
        "page": page,
        "limit": limit
    }
