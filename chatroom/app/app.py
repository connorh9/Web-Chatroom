from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

load_dotenv()

frontend_urls_str = os.getenv('FRONTEND_URLS', 'http://localhost:3000')
frontend_urls = [url.strip() for url in frontend_urls_str.split(',')]

db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, 
         resources={r"/*": {
             "origins": frontend_urls,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
             "expose_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 3600
         }}
    )


    @app.before_request
    def handle_options():
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin", "*"))
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
            response.headers.add("Access-Control-Allow-Credentials", "true")
            return response, 200
    
    # Add CORS headers to all responses
    # @app.after_request
    # def after_request(response):
    #     origin = request.headers.get('Origin')
    #     print(f"Request from origin: {origin}")
    #     print(f"Response status: {response.status_code}")
    #     response.headers.add('Access-Control-Allow-Origin', "*")
    #     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    #     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    #     return response

    db.init_app(app)
    socketio.init_app(app)

    with app.app_context():
        import routes
        import models
        #db.create_all()
    
    return app

app = create_app()
