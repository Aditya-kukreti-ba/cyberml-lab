import os
from contextlib import asynccontextmanager
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load default datasets on startup."""
    print("CyberML Lab API starting up...")
    yield
    print("CyberML Lab API shutting down...")


app = FastAPI(
    title="CyberML Lab API",
    description="AI-Powered Cybersecurity ML Lab — train and compare supervised learning models on cybersecurity datasets",
    version="1.0.0",
    lifespan=lifespan,
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
# Add production frontend URL from env var if set
_frontend_url = os.environ.get("FRONTEND_URL", "")
if _frontend_url:
    ALLOWED_ORIGINS.append(_frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print(f"Unhandled exception on {request.url}:\n{tb}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"{type(exc).__name__}: {str(exc)}"},
    )


@app.get("/")
async def root():
    return {"message": "CyberML Lab API", "docs": "/docs", "version": "1.0.0"}
