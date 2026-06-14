from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey,
    Enum,
    CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.step.enums import ImageScope

class TakeImageStep(Base):
    __tablename__ = "take_image_steps"
    __table_args__ = (
        CheckConstraint("center_x IS NULL OR center_x >= 0", name="ck_take_image_center_x_nonneg"),
        CheckConstraint("center_y IS NULL OR center_y >= 0", name="ck_take_image_center_y_nonneg"),
        CheckConstraint(
            "(image_scope = 'section' AND center_x IS NOT NULL AND center_y IS NOT NULL) "
            "OR (image_scope = 'full_battery' AND center_x IS NULL AND center_y IS NULL)",
            name="ck_take_image_coords_match_scope",
        ),
    )

    step_id = Column(
        UUID(as_uuid=True),
        ForeignKey("steps.id", ondelete="CASCADE"),
        primary_key=True,
    )
    include_pointcloud = Column(Boolean, nullable=False, default=False)
    image_scope = Column(Enum(ImageScope, name="image_scope_enum"), nullable=False)
    center_x = Column(Integer, nullable=True)
    center_y = Column(Integer, nullable=True)

    step = relationship("Step", back_populates="take_image_detail")
