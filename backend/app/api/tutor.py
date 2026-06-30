from fastapi import APIRouter, Depends
from app.core.security import get_current_user_id
from app.schemas.schemas import TutorChatRequest, TutorChatResponse
from app.services.ai_tutor import run_tutor

router = APIRouter()

@router.post("/chat", response_model=TutorChatResponse)
def tutor_chat(
    request: TutorChatRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    # Map pydantic messages to dictionary list
    history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]
    
    result = run_tutor(
        message=request.message,
        chat_history=history,
        subject=request.subject or "General"
    )
    
    return TutorChatResponse(
        reply=result["reply"],
        suggested_followups=result["suggested_followups"]
    )
