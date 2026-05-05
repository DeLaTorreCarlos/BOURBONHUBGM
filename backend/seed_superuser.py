from app.db.database import SessionLocal, engine
from app.crud.user import create_user, get_user_by_email
from app.schemas.user import UserCreate

db = SessionLocal()

# Check if superadmin exists
email = "mrwizard@bourbonhub.com"
existing_user = get_user_by_email(db, email=email)
if not existing_user:
    superuser = UserCreate(
        email=email,
        password="777!",
        full_name="mrwizard",
        role="superadmin",
        is_active=True
    )
    user = create_user(db=db, user=superuser)
    print(f"Created superuser: mrwizard / 777! with id: {user.id}")
else:
    print("Superuser already exists.")
    
db.close()
