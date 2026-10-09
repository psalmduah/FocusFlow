from fastapi import FastAPI, HTTPException
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import text

from .database import Base, SessionLocal, engine
from .routes import router


app = FastAPI(
    title="FocusFlow API",
    version="1.0.0"
)


Base.metadata.create_all(bind=engine)


app.include_router(router)


@app.get("/")
def root():

    return {
        "application": "FocusFlow",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.get("/ready")
def readiness():

    db = SessionLocal()

    try:

        db.execute(text("SELECT 1"))

        return {
            "status": "ready",
            "database": "connected"
        }

    except Exception:

        raise HTTPException(
            status_code=503,
            detail="Database unavailable"
        )

    finally:
        db.close()


Instrumentator().instrument(app).expose(
    app,
    endpoint="/metrics"
)
