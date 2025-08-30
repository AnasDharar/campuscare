from fastapi import FastAPI, Depends  # Correctly imported at the top
from sqlalchemy.orm import Session
from chatbot.backend.database import SessionLocal, engine
from . import models, schemas
from .gemini import generate_therapist_response
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app instance
app = FastAPI(title="Therapist Chatbot")

# Allowed origins for CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:3000",  # React frontend
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if they don't already exist
models.Base.metadata.create_all(bind=engine)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# POST endpoint for chatting with the therapist
@app.post("/chat", response_model=schemas.PromptResponse)
def chat_with_therapist(request: schemas.PromptRequest, db: Session = Depends(get_db)):
    # Generate response from the therapist
    response = generate_therapist_response(request.user_id, request.prompt)

    # Save chat history to the database
    chat_entry = models.ChatHistory(
        user_id=request.user_id,
        prompt=request.prompt,
        response=response
    )
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)

    # Return the generated response
    return {"response": response}

# GET endpoint for retrieving the user's chat history
@app.get("/history/{user_id}", response_model=list[schemas.ChatHistoryItem])
def get_user_history(user_id: str, db: Session = Depends(get_db)):
    # Query for the user's chat history, ordered by timestamp (most recent first)
    history = db.query(models.ChatHistory).filter(models.ChatHistory.user_id == user_id).order_by(models.ChatHistory.timestamp.desc()).all()
    return history
