# app/main.py
from fastapi import FastAPI
from app.api.v1 import router as api_v1_router 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
from app.tasks.auto_approve_task import start_auto_approve_task

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(api_v1_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """
    Khởi động background task khi server start
    """
    # Khởi động auto-approve task
    start_auto_approve_task()