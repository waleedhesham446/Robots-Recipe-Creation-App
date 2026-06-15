import sys


def test_models_have_base_and_recipe():
    # Ensure package import works in CI and Alembic-related symbols are available
    sys.path.insert(0, '.')
    from app import models

    assert hasattr(models, "Base"), "app.models should export Base"
    assert hasattr(models, "Recipe"), "app.models should export Recipe"
