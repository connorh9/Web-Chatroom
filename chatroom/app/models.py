from app import db
from datetime import datetime, timezone
from sqlalchemy import func

class Chatroom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    messages= db.relationship('Message', backref='chatroom', lazy=True)

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter(func.lower(cls.name) == func.lower(name)).first()

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatroom.id'), nullable=False)
    user_id = db.Column(db.String(36), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'chatroom_id': self.chatroom_id,
            'user_id': self.user_id
        }

