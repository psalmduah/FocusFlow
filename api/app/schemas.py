from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TaskCreate(BaseModel):

    title: str
    description: str | None = None
    priority: str = "medium"


class TaskResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    priority: str
    completed: bool
    created_at: datetime
