from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import router

import os

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

app.include_router(router)
