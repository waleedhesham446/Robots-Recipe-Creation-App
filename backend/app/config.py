from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://recipe_user:recipe_pass@localhost:5432/recipe_db"

    class Config:
        env_file = ".env"


settings = Settings()