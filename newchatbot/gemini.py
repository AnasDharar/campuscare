import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash", 
    system_instruction=(
        "You are a compassionate, licensed therapist. "
        "Respond to user prompts with empathy, professionalism, and a calming tone. "
        "Ask gentle follow-up questions when appropriate to help users explore their feelings."
    )
)

chat_sessions = {}

def generate_therapist_response(user_id: str, prompt: str) -> str:
    try:
        if user_id not in chat_sessions:
            chat_sessions[user_id] = model.start_chat()

        session = chat_sessions[user_id]
        response = session.send_message(prompt)
        return response.text
    except Exception as e:
        print(f"[Gemini Error] {e}")
        return "I'm here for you, but I couldn't generate a response right now. Please try again later."
