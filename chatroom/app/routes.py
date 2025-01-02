from flask import request, jsonify
from app import app, db
from app.models import Chatroom, Message

@app.route('/chatrooms', methods=['GET'])
def get_chatrooms():
    chatrooms = Chatroom.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in chatrooms])

@app.route('/chatrooms/<int:chatroom_id>/messages', methods=['GET'])
def get_messages(chatroom_id):
    messages=Message.query.filter_by(chatroom_id=chatroom_id).all()
    return jsonify([{'id':m.id, 'content': m.content} for m in messages])

@app.route('/chatrooms/<int:chatroom_id>/messages', methods=['POST'])
def create_message(chatroom_id):
    content = request.json.get('content')
    if content:
        nm = Message(content=content, chatroom_id=chatroom_id)
        db.session.add(nm)
        db.session.commit()
        return jsonify({'id':nm.id, 'content':nm.content}), 201
    return jsonify({'error': 'Content required'}), 400

@app.route('/chatrooms', methods=['POST'])
def create_chatroom():
    name = request.json.get('name')
    if name:
        nc = Chatroom(name=name)
        db.session.add(nc)
        db.session.commit()
        return jsonify({'id' : nc.id, 'name': nc.name}), 201
    return jsonify({'error': 'Name is required'}), 400