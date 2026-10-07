from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    product_id: str
    qty: int
    price: float

class Customer(BaseModel):
    id: str
    name: str

class Order(BaseModel):
    order_id: str
    customer: Customer
    items: List[OrderItem]
    order_date: str

class JSONIngestRequest(BaseModel):
    orders: List[Order]

class UserCreate(BaseModel):
    name: str
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
