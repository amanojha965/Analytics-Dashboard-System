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
    connect_args={"connect_timeout": 30} if "postgresql" in DATABASE_URL else {}
)

def init_db():
    try:
        inspector = inspect(engine)
        if not inspector.has_table("orders"):
            pd.DataFrame(columns=["order_id", "customer_id", "customer_name", "order_date", "product_id", "qty", "price"]).to_sql("orders", engine, index=False)
        if not inspector.has_table("shipments"):
            pd.DataFrame(columns=["shipment_id", "order_id", "delivery_days", "status"]).to_sql("shipments", engine, index=False)
        if not inspector.has_table("products"):
            pd.DataFrame(columns=["ProductID", "ProductName", "Category"]).to_sql("products", engine, index=False)
        if not inspector.has_table("users"):
            # users table schema: id (integer auto-increment), name (text), username (text), password_hash (text)
            from sqlalchemy import Table, Column, Integer, String, MetaData
            metadata = MetaData()
            Table('users', metadata,
                  Column('id', Integer, primary_key=True, autoincrement=True),
                  Column('name', String, nullable=True),
                  Column('username', String, unique=True, nullable=False),
                  Column('password_hash', String, nullable=False))
            metadata.create_all(engine)
        else:
            # Add name column if table exists but column doesn't
            from sqlalchemy.sql import text
            with engine.connect() as conn:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR"))
                    conn.commit()
                except Exception:
                    pass
    except Exception as e:
        print(f"Warning: Database initialization failed. Error: {e}")

init_db()
