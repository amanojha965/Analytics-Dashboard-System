from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routes import auth_routes, ingest_routes, analytics_routes

app = FastAPI(title="Unified Retail ETL & Analytics Dashboard System")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [url.strip() for url in frontend_url.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(ingest_routes.router)
app.include_router(analytics_routes.router)
