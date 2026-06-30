import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from app.core.security import get_current_user_id
from app.schemas.schemas import PDFChatRequest, PDFChatResponse
from app.services.pdf_service import store_pdf_content, query_pdf, extract_text_from_file

router = APIRouter()

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user_id: int = Depends(get_current_user_id)
):
    if not file.filename.endswith(('.pdf', '.txt', '.md')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload PDF, TXT, or MD files."
        )
    
    try:
        contents = await file.read()
        text = extract_text_from_file(file.filename, contents)
        
        pdf_id = str(uuid.uuid4())
        num_pages = store_pdf_content(pdf_id, text)
        
        return {
            "pdf_id": pdf_id,
            "filename": file.filename,
            "pages": num_pages,
            "message": "File uploaded and indexed successfully!"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file: {str(e)}"
        )

@router.post("/query", response_model=PDFChatResponse)
def query_uploaded_pdf(
    request: PDFChatRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]
    result = query_pdf(request.pdf_id, request.message, history)
    
    return PDFChatResponse(
        reply=result["reply"],
        source_pages=result["source_pages"]
    )
