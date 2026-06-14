import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict

from app.schemas.step import StepCreate, StepOut


class RecipeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    steps: List[StepCreate] = Field(default_factory=list, min_length=1)


class RecipeUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    steps: List[StepCreate] = None  # Allow setting to None to indicate no change, or an empty list to clear steps


class RecipeOut(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    version: int
    created_at: datetime
    updated_at: datetime
    steps: List[StepOut] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
