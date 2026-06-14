from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Enum,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.step.enums import UnscrewingMode

class UnscrewingStep(Base):
    __tablename__ = "unscrewing_steps"
    __table_args__ = (
        CheckConstraint("coordinate_x IS NULL OR coordinate_x >= 0", name="ck_unscrew_x_nonneg"),
        CheckConstraint("coordinate_y IS NULL OR coordinate_y >= 0", name="ck_unscrew_y_nonneg"),
        CheckConstraint(
            "(unscrewing_mode = 'specific' AND coordinate_x IS NOT NULL AND coordinate_y IS NOT NULL) "
            "OR (unscrewing_mode = 'automatic' AND coordinate_x IS NULL AND coordinate_y IS NULL)",
            name="ck_unscrew_coords_match_mode",
        ),
    )

    step_id = Column(
        UUID(as_uuid=True),
        ForeignKey("steps.id", ondelete="CASCADE"),
        primary_key=True,
    )
    unscrewing_mode = Column(Enum(UnscrewingMode, name="unscrewing_mode_enum"), nullable=False)
    coordinate_x = Column(Integer, nullable=True)
    coordinate_y = Column(Integer, nullable=True)

    step = relationship("Step", back_populates="unscrewing_detail")