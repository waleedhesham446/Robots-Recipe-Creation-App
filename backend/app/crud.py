import uuid
from typing import List

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app import models, schemas


def _create_step_detail(db: Session, step: models.Step, step_in: schemas.StepCreate):
    if step_in.step_type == models.StepType.take_image:
        detail = models.TakeImageStep(
            step_id=step.id,
            **step_in.properties.model_dump(),
        )
    else:
        detail = models.UnscrewingStep(
            step_id=step.id,
            **step_in.properties.model_dump(),
        )
    db.add(detail)
    return detail


def get_recipe(db: Session, recipe_id: uuid.UUID) -> models.Recipe | None:
    return (
        db.query(models.Recipe)
        .options(
            joinedload(models.Recipe.steps).joinedload(models.Step.take_image_detail),
            joinedload(models.Recipe.steps).joinedload(models.Step.unscrewing_detail),
        )
        .filter(models.Recipe.id == recipe_id)
        .first()
    )


def list_recipes(
    db: Session, search: str | None = None, skip: int = 0, limit: int = 100
) -> tuple[List[models.Recipe], int]:
    query = db.query(models.Recipe)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Recipe.name.ilike(pattern),
                models.Recipe.description.ilike(pattern),
            )
        )

    total = query.count()
    items = (
        query
        .order_by(models.Recipe.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def create_recipe(db: Session, recipe_in: schemas.RecipeCreate) -> models.Recipe:
    recipe = models.Recipe(name=recipe_in.name, description=recipe_in.description)
    db.add(recipe)
    db.flush()  # assign recipe.id without committing

    for index, step_in in enumerate(recipe_in.steps):
        step = models.Step(
            recipe_id=recipe.id,
            step_type=step_in.step_type,
            name=step_in.name,
            description=step_in.description,
            order_index=index,
        )
        db.add(step)
        db.flush()  # assign step.id
        _create_step_detail(db, step, step_in)

    db.commit()
    db.refresh(recipe)
    return get_recipe(db, recipe.id)


def update_recipe(
    db: Session, recipe: models.Recipe, recipe_in: schemas.RecipeUpdate
) -> models.Recipe:
    if recipe_in.name is not None:
        recipe.name = recipe_in.name
    if recipe_in.description is not None:
        recipe.description = recipe_in.description
    if recipe_in.steps is not None:
        for step in list(recipe.steps):
            db.delete(step)
        db.flush()
        for index, step_in in enumerate(recipe_in.steps):
            step = models.Step(
                recipe_id=recipe.id,
                step_type=step_in.step_type,
                name=step_in.name,
                description=step_in.description,
                order_index=index,
            )
            db.add(step)
            db.flush()
            _create_step_detail(db, step, step_in)
    recipe.version += 1
    db.commit()
    db.refresh(recipe)
    return recipe


def delete_recipe(db: Session, recipe: models.Recipe) -> None:
    db.delete(recipe)
    db.commit()
