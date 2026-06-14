from typing import Generic, List, TypeVar

from pydantic import BaseModel

from app import schemas

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int

    @property
    def total_pages(self) -> int:
        if self.page_size == 0:
            return 0
        return (self.total + self.page_size - 1) // self.page_size

class PaginatedRecipes(PaginatedResponse[schemas.RecipeOut]):
    pass