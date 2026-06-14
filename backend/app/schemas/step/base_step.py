from typing import Optional

from pydantic import BaseModel

from app.models import StepType


class BaseStepCreate(BaseModel):
    name: str
    description: Optional[str] = None
    step_type: StepType
