from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# In case we run without Docker Compose for local debug, allow sqlite fallback or use postgresql
# If DATABASE_URL starts with postgresql:// and not postgresql+psycopg2://, we can map it if needed,
# but psycopg2-binary is installed and postgresql:// works with newer SQLAlchemy/Psycopg2.
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# SQLite fallback if we ever want to run without postgres for quick testing
if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
