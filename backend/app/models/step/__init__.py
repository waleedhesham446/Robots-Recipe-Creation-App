import uuid

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    Enum,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base

from app.models.step.enums import *
from app.models.step.take_image import *
from app.models.step.unscrewing import *

class Step(Base):
    __tablename__ = "steps"
    __table_args__ = (
        UniqueConstraint("recipe_id", "order_index", name="uq_step_recipe_order"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    recipe_id = Column(
        UUID(as_uuid=True),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )
    step_type = Column(Enum(StepType, name="step_type_enum"), nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    recipe = relationship("Recipe", back_populates="steps")

    take_image_detail = relationship(
        "TakeImageStep",
        back_populates="step",
        uselist=False,
        cascade="all, delete-orphan",
    )
    unscrewing_detail = relationship(
        "UnscrewingStep",
        back_populates="step",
        uselist=False,
        cascade="all, delete-orphan",
    )

    @property
    def properties(self):
        if self.step_type == StepType.take_image:
            return self.take_image_detail
        elif self.step_type == StepType.unscrewing:
            return self.unscrewing_detail
        return None
