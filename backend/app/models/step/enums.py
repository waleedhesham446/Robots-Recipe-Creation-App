import enum

class StepType(str, enum.Enum):
    take_image = "take_image"
    unscrewing = "unscrewing"


class ImageScope(str, enum.Enum):
    full_battery = "full_battery"
    section = "section"


class UnscrewingMode(str, enum.Enum):
    automatic = "automatic"
    specific = "specific"
