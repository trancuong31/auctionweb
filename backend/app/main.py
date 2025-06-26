# app/main.py
from fastapi import FastAPI
from app.api.v1 import router as api_v1_router 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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