from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from app.services.llm import call_llm

class TutorState(TypedDict):
    message: str
    chat_history: List[Dict[str, str]]
    subject: str
    agent_response: str
    suggested_followups: List[str]

def explain_concept(state: TutorState) -> TutorState:
    message = state["message"]
    subject = state["subject"]
    history_str = ""
    for msg in state["chat_history"][-5:]: # Last 5 messages
        history_str += f"{msg['role']}: {msg['content']}\n"
    
    system_prompt = (
        "You are an expert AI Tutor on StudyMentor AI. "
        "Explain concepts clearly, use analogies, and break down complex ideas. "
        f"The current subject of study is {subject}."
    )
    
    prompt = (
        f"Here is the study history:\n{history_str}\n"
        f"Student says: {message}\n\n"
        "Explain this concept thoroughly, using formatting (markdown, bolding) to help readability."
    )
    
    response = call_llm(prompt, system_prompt)
    state["agent_response"] = response
    return state

def suggest_questions(state: TutorState) -> TutorState:
    agent_response = state["agent_response"]
    
    system_prompt = (
        "You are an educational assistant. Based on an explanation, suggest 3 quick follow-up questions "
        "or prompts that the student can click on to continue learning. Format them as a JSON list of strings, like "
        '["Explain that again with a different analogy", "Give me a practice question", "How does this relate to real life?"]'
    )
    
    prompt = f"Based on this explanation:\n\n{agent_response}\n\nProvide 3 quick follow-up learning prompts."
    res = call_llm(prompt, system_prompt)
    
    try:
        # Clean response to parse JSON
        if "```json" in res:
            res = res.split("```json")[1].split("```")[0].strip()
        elif "```" in res:
            res = res.split("```")[1].split("```")[0].strip()
        import json
        followups = json.loads(res)
        if isinstance(followups, list):
            state["suggested_followups"] = [str(x) for x in followups[:3]]
        else:
            state["suggested_followups"] = ["Tell me more", "Give me an example", "Test my knowledge"]
    except Exception:
        state["suggested_followups"] = [
            "Explain that again with a different analogy",
            "Give me a practice question", 
            "How does this relate to real-life applications?"
        ]
        
    return state

# Setup LangGraph workflow
workflow = StateGraph(TutorState)
workflow.add_node("explain", explain_concept)
workflow.add_node("suggest", suggest_questions)

workflow.set_entry_point("explain")
workflow.add_edge("explain", "suggest")
workflow.add_edge("suggest", END)

tutor_agent = workflow.compile()

def run_tutor(message: str, chat_history: List[Dict[str, str]], subject: str = "General") -> Dict[str, Any]:
    initial_state = {
        "message": message,
        "chat_history": chat_history,
        "subject": subject,
        "agent_response": "",
        "suggested_followups": []
    }
    result = tutor_agent.invoke(initial_state)
    return {
        "reply": result["agent_response"],
        "suggested_followups": result["suggested_followups"]
    }
