import uuid
from typing import Optional, Union

from pydantic import BaseModel, ConfigDict

from app.models import StepType

from app.schemas.step.take_image import *
from app.schemas.step.unscrewing import *


StepCreate = Union[TakeImageStepCreate, UnscrewingStepCreate]


class StepOut(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    step_type: StepType
    order_index: int
    properties: Union[TakeImageStepOut, UnscrewingStepOut]

    model_config = ConfigDict(from_attributes=True)