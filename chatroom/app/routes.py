from flask import request, jsonify
from app import app, db, socketio
from app.models import Chatroom, Message
from datetime import datetime
from flask_socketio import SocketIO, emit, join_room, leave_room

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)

   
@app.route('/chatrooms', methods=['GET'])
def get_chatrooms():
    chatrooms = Chatroom.query.all()
    return jsonify( {'chatrooms':[{'id': c.id, 'name': c.name} for c in chatrooms]})

@app.route('/chatrooms/<int:chatroom_id>/messages', methods=['GET'])
def get_messages(chatroom_id):
    messages=Message.query.filter_by(chatroom_id=chatroom_id).all()
    return jsonify({'messages':[{'id':m.id, 'content': m.content} for m in messages]})

@app.route('/messages', methods=['POST'])
def create_message():
    data = request.json
    # data should contain: content, chatroom_id, and user_id
    if not all(key in data for key in ['content', 'chatroom_id', 'user_id']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    # Verify the chatroom exists
    chatroom = Chatroom.query.get(data['chatroom_id'])
    if not chatroom:
        return jsonify({'error': 'Chatroom not found'}), 404

    message = Message(
        content=data['content'],
        chatroom_id=data['chatroom_id'],
        user_id=data['user_id'],
        timestamp=datetime.now(datetime.UTC)
    )
    db.session.add(message)
    db.session.commit()
    socketio.emit('new_message', message.to_dict(), room=str(data['chatroom_id']))
    
    return jsonify(message.to_dict()), 201

@app.route('/chatrooms', methods=['POST'])
def create_chatrooms():
    data = request.get_json()
    names = data.get('names', [])
    created_rooms = []
    skipped_rooms = []

    for name in names:
        # Check if chatroom already exists
        existing_room = Chatroom.query.filter_by(name=name).first()
        if existing_room:
            skipped_rooms.append(name)
        else:
            room = Chatroom(name=name)
            db.session.add(room)
            created_rooms.append(name)

    db.session.commit()
    
    return jsonify({
        'created_chatrooms': created_rooms,
        'skipped_chatrooms': skipped_rooms
    }), 201 if created_rooms else 200

@app.route('/chatrooms/name/<string:name>', methods=['GET'])
def get_chatroom_id(name):
    chatroom = Chatroom.query.filter_by(name=name).first()
    if chatroom:
        return jsonify({'id': chatroom.id, 'name': chatroom.name}), 200
    return jsonify({'error': 'Chatroom not found'}), 404