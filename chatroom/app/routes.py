from flask import request, jsonify
from app import db, socketio
from app.models import Chatroom, Message
from datetime import datetime, timezone
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import current_app as app

@socketio.on('join')
def on_join(data):
    room = data.get('room')
    if not Chatroom.query.filter_by(id=room).first():
        return emit('error', {'error': 'Chatroom not found'})
    join_room(room)
    emit('joined_room', {'room': room})

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
    messages = Message.query.filter_by(chatroom_id=chatroom_id).all()
    return jsonify({
        'messages': [{
            'id': message.id,
            'content': message.content,
            'user_id': message.user_id,
            'timestamp': message.timestamp
        } for message in messages]
    })

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
        timestamp=datetime.now(timezone.utc)
    )
    db.session.add(message)
    db.session.commit()

    # Emit socket event after message is created
    socketio.emit('new_message', message.to_dict(), room=str(message.chatroom_id))

    return jsonify(message.to_dict()), 201

@app.route('/chatrooms', methods=['POST'])
def create_chatrooms():
    data = request.json
    names = data.get('names', [])
    created_chatrooms = []
    
    for name in names:
        # Case insensitive search
        chatroom = Chatroom.get_by_name(name)
        if not chatroom:
            # Store with original casing
            chatroom = Chatroom(name=name)
            db.session.add(chatroom)
            created_chatrooms.append(name)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Chatrooms processed successfully',
        'created_chatrooms': created_chatrooms,
        'all_chatrooms': names
    }), 201

@app.route('/chatrooms/name/<string:name>', methods=['GET'])
def get_chatroom_id(name):
    chatroom = Chatroom.get_by_name(name)
    if chatroom:
        return jsonify({'id': chatroom.id, 'name': chatroom.name}), 200
    return jsonify({'error': 'Chatroom not found'}), 404