from typing import Optional, Literal

from pydantic import BaseModel, Field, model_validator, ConfigDict

from app.models import StepType, UnscrewingMode
from app.schemas.step.base_step import BaseStepCreate


class UnscrewingStepBase(BaseModel):
    unscrewing_mode: UnscrewingMode
    coordinate_x: Optional[int] = Field(default=None, ge=0)
    coordinate_y: Optional[int] = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_coordinates(self):
        if self.unscrewing_mode == UnscrewingMode.specific:
            if self.coordinate_x is None or self.coordinate_y is None:
                raise ValueError(
                    "coordinate_x and coordinate_y are required when unscrewing_mode is 'specific'"
                )
        else:
            if self.coordinate_x is not None or self.coordinate_y is not None:
                raise ValueError(
                    "coordinate_x and coordinate_y must not be set when unscrewing_mode is 'automatic'"
                )
        return self


class UnscrewingStepOut(UnscrewingStepBase):
    model_config = ConfigDict(from_attributes=True)


class UnscrewingStepCreate(BaseStepCreate):
    step_type: Literal[StepType.unscrewing] = StepType.unscrewing
    properties: UnscrewingStepBase
