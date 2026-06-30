from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    name: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ArticleInput(BaseModel):
    title: Optional[str] = Field(default="", max_length=300)
    text: str = Field(min_length=20, max_length=20000)


class PredictionOut(BaseModel):
    id: str
    title: Optional[str] = ""
    text_snippet: str
    label: str
    confidence: float
    explanation: list[str]
    created_at: datetime


class PredictionHistoryItem(BaseModel):
    id: str
    title: Optional[str] = ""
    text_snippet: str
    label: str
    confidence: float
    created_at: datetime
