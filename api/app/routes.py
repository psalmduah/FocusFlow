from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import models, schemas
from .database import get_db


router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)


@router.get("", response_model=list[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):

    return db.query(models.Task).all()


@router.post("", response_model=schemas.TaskResponse, status_code=201)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):

    new_task = models.Task(
        title=task.title,
        description=task.description,
        priority=task.priority
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.patch("/{task_id}/complete")
def complete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.get(models.Task, task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.completed = True

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.get(models.Task, task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return
