from fastapi import APIRouter, Depends
from app.core.security import get_current_user_id
from app.schemas.schemas import CodeAnalysisRequest, CodeAnalysisResponse
from app.services.code_analyzer import analyze_code_snippet

router = APIRouter()

@router.post("/analyze", response_model=CodeAnalysisResponse)
def analyze_code(
    request: CodeAnalysisRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    analysis = analyze_code_snippet(
        code=request.code,
        language=request.language,
        problem_description=request.problem_description
    )
    
    return CodeAnalysisResponse(
        is_correct=analysis.get("is_correct"),
        feedback=analysis.get("feedback", "Code analyzed."),
        suggestions=analysis.get("suggestions", []),
        fixed_code=analysis.get("fixed_code")
    )
