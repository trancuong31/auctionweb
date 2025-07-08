# app/main.py
from fastapi import FastAPI
from app.api.v1 import router as api_v1_router 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.tasks.auto_approve import  start_auto_set_winner_task
from fastapi.responses import FileResponse
import os

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

# Mount assets (Vite sẽ build vào dist/assets)
app.mount("/assets", StaticFiles(directory="app/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_vite_app(full_path: str):
    # Không override API và uploads
    if full_path.startswith("api/") or full_path.startswith("uploads/"):
        return {"detail": "Not Found"}
    index_path = os.path.join("app", "dist", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"detail": "index.html not found"}

@app.on_event("startup")
async def startup_event():
    # Tự động set winner
    start_auto_set_winner_task()