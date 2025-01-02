from app import db

class Chatroom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    messages= db.relationship('Message', backref='chatroom', lazy=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatroom.id'), nullable=False)

