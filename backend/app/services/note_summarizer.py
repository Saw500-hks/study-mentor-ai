from app.services.llm import call_llm

def generate_notes_summary(title: str, subject: str, original_text: str) -> str:
    system_prompt = (
        "You are an expert AI Study Assistant. Summarize and format the provided student notes or textbooks. "
        "Use Markdown with headers, bullet points, checklists, and highlighted quotes. "
        "Organize the content logically so it is easy to review."
    )

    prompt = (
        f"Subject: {subject}\n"
        f"Notes Title: {title}\n\n"
        f"Content to Summarize:\n{original_text}"
    )

    return call_llm(prompt, system_prompt)
