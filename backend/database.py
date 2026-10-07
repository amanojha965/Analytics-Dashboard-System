import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect
import pandas as pd

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dashboard.db")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={"connect_timeout": 10} if "postgresql" in DATABASE_URL else {}
)

def init_db():
    inspector = inspect(engine)
    if not inspector.has_table("orders"):
        pd.DataFrame(columns=["order_id", "customer_id", "customer_name", "order_date", "product_id", "qty", "price"]).to_sql("orders", engine, index=False)
    if not inspector.has_table("shipments"):
        pd.DataFrame(columns=["shipment_id", "order_id", "delivery_days", "status"]).to_sql("shipments", engine, index=False)
    if not inspector.has_table("products"):
        pd.DataFrame(columns=["ProductID", "ProductName", "Category"]).to_sql("products", engine, index=False)

init_db()
