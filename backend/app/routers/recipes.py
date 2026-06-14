import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app import crud, schemas, models
from app.database import get_db

router = APIRouter(prefix="/recipes", tags=["recipes"])


def _get_recipe_or_404(db: Session, recipe_id: uuid.UUID) -> models.Recipe:
    recipe = crud.get_recipe(db, recipe_id)
    if recipe is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.get("", response_model=schemas.PaginatedRecipes)
def list_recipes(
    page: int = 1,
    page_size: int = 20,
    search: str = None,
    db: Session = Depends(get_db),
):
    if page < 1:
        raise HTTPException(status_code=400, detail="page must be >= 1")
    if page_size < 1 or page_size > 100:
        raise HTTPException(status_code=400, detail="page_size must be between 1 and 100")

    skip = (page - 1) * page_size
    items, total = crud.list_recipes(db, search=search, skip=skip, limit=page_size)

    return schemas.PaginatedRecipes(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=schemas.RecipeOut, status_code=status.HTTP_201_CREATED)
def create_recipe(recipe_in: schemas.RecipeCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_recipe(db, recipe_in)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create recipe: {exc.orig}",
        )


@router.get("/{recipe_id}", response_model=schemas.RecipeOut)
def get_recipe(recipe_id: uuid.UUID, db: Session = Depends(get_db)):
    return _get_recipe_or_404(db, recipe_id)


@router.patch("/{recipe_id}", response_model=schemas.RecipeOut)
def update_recipe(
    recipe_id: uuid.UUID, recipe_in: schemas.RecipeUpdate, db: Session = Depends(get_db)
):
    recipe = _get_recipe_or_404(db, recipe_id)
    return crud.update_recipe(db, recipe, recipe_in)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: uuid.UUID, db: Session = Depends(get_db)):
    recipe = _get_recipe_or_404(db, recipe_id)
    crud.delete_recipe(db, recipe)

