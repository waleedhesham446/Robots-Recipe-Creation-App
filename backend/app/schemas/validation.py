import uuid
from typing import Optional, List

from pydantic import BaseModel, Field

class ValidationIssue(BaseModel):
    step_id: Optional[uuid.UUID] = None
    message: str


class RecipeValidationResult(BaseModel):
    valid: bool
    issues: List[ValidationIssue] = Field(default_factory=list)