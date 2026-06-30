from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.study_plan import StudyPlan
from app.schemas.schemas import StudyPlanCreateRequest, StudyPlanResponse
from app.services.study_planner import generate_study_plan

router = APIRouter()

@router.post("/generate", response_model=StudyPlanResponse)
def create_generated_study_plan(
    request: StudyPlanCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    # Call AI generation service
    timeline = generate_study_plan(
        title=request.title,
        goal=request.goal,
        duration_weeks=request.duration_weeks,
        daily_hours=request.daily_hours
    )
    
    # Save to database
    db_plan = StudyPlan(
        title=request.title,
        goal=request.goal,
        timeline=timeline,
        created_by=current_user_id
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    
    return db_plan

@router.get("/list", response_model=List[StudyPlanResponse])
def list_study_plans(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return db.query(StudyPlan).filter(StudyPlan.created_by == current_user_id).order_by(StudyPlan.created_at.desc()).all()

@router.get("/{plan_id}", response_model=StudyPlanResponse)
def get_study_plan_by_id(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    plan = db.query(StudyPlan).filter(StudyPlan.id == plan_id, StudyPlan.created_by == current_user_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study plan not found"
        )
    return plan
