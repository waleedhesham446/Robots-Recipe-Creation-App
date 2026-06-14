from typing import Optional, Literal

from pydantic import BaseModel, Field, model_validator, ConfigDict

from app.models import StepType, ImageScope
from app.schemas.step.base_step import BaseStepCreate


class TakeImageStepBase(BaseModel):
    include_pointcloud: bool = False
    image_scope: ImageScope
    center_x: Optional[int] = Field(default=None, ge=0)
    center_y: Optional[int] = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_coordinates(self):
        if self.image_scope == ImageScope.section:
            if self.center_x is None or self.center_y is None:
                raise ValueError(
                    "center_x and center_y are required when image_scope is 'section'"
                )
        else:
            if self.center_x is not None or self.center_y is not None:
                raise ValueError(
                    "center_x and center_y must not be set when image_scope is 'full_battery'"
                )
        return self


class TakeImageStepOut(TakeImageStepBase):
    model_config = ConfigDict(from_attributes=True)


class TakeImageStepCreate(BaseStepCreate):
    step_type: Literal[StepType.take_image] = StepType.take_image
    properties: TakeImageStepBase

