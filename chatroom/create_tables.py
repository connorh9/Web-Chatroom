from app import create_app, db

import secrets
print("Generated secret key:", secrets.token_hex(32))

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully!") 