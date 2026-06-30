import re
from typing import List, Dict, Any
from app.services.llm import call_llm

# In-memory store for pdf pages: pdf_id -> List[str] (each element is page content)
pdf_storage: Dict[str, List[str]] = {}

def store_pdf_content(pdf_id: str, content: str) -> int:
    """
    Splits string content into page-like chunks and stores them.
    Returns the number of pages.
    """
    # Split content by formfeed character or double newlines to simulate page splits
    pages = [p.strip() for p in re.split(r'\x0c|\n\n\n+', content) if p.strip()]
    if not pages:
        pages = [content]
    
    pdf_storage[pdf_id] = pages
    return len(pages)

def query_pdf(pdf_id: str, message: str, chat_history: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Performs keyword searching over the stored PDF pages, retrieves relevant chunks,
    and calls the LLM to formulate an answer with sources.
    """
    pages = pdf_storage.get(pdf_id, [])
    if not pages:
        return {
            "reply": "No document content found. Please upload a PDF file first.",
            "source_pages": []
        }
    
    # 1. Retrieve the most relevant pages
    # Let's search using word overlaps
    query_words = set(re.findall(r'\w+', message.lower()))
    page_scores = []
    
    for i, page in enumerate(pages):
        page_words = set(re.findall(r'\w+', page.lower()))
        score = len(query_words.intersection(page_words))
        page_scores.append((i + 1, page, score))
    
    # Sort by score descending, get top 3
    page_scores.sort(key=lambda x: x[2], reverse=True)
    top_matches = [x for x in page_scores if x[2] > 0][:3]
    
    # If no matches have overlap, take the first page as fallback context
    if not top_matches:
        context_pages = [(1, pages[0])]
    else:
        context_pages = [(item[0], item[1]) for item in top_matches]
    
    # 2. Formulate prompt
    context_str = ""
    source_pages = []
    for num, text in context_pages:
        context_str += f"--- PAGE {num} ---\n{text}\n\n"
        source_pages.append(num)
    
    history_str = ""
    for msg in chat_history[-4:]:
        history_str += f"{msg['role']}: {msg['content']}\n"
        
    system_prompt = (
        "You are an AI assistant helping a student study a PDF document. "
        "Answer the user's question using ONLY the provided document context below. "
        "Be extremely objective and accurate. If the answer is not in the context, say so."
    )
    
    prompt = (
        f"PDF Document Context:\n{context_str}\n"
        f"Conversation History:\n{history_str}\n"
        f"Student Question: {message}\n\n"
        "Provide a detailed answer citing the relevant facts from the document context."
    )
    
    reply = call_llm(prompt, system_prompt)
    
    return {
        "reply": reply,
        "source_pages": source_pages
    }
