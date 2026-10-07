import io
import pandas as pd
import xmltodict
from fastapi import HTTPException
from models import JSONIngestRequest
from database import engine

def process_json_ingest(request: JSONIngestRequest):
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

async def process_xml_ingest(body: bytes):
    try:
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

async def process_csv_ingest(content: bytes):
    try:
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
