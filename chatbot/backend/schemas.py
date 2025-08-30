import pydantic
from pydantic import BaseModel
from datetime import datetime

class PromptRequest(BaseModel):
    user_id: str
    prompt: str

class PromptResponse(BaseModel):
    response: str

class ChatHistoryItem(BaseModel):
    id: int
    prompt: str
    response: str
    timestamp: datetime

    class Config:
        if hasattr(pydantic.BaseConfig, "orm_mode"):
            orm_mode = True
        else:
            from_attributes = True
