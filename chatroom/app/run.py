from chatroom.app.app import app, socketio
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    socketio.run(app, 
                 debug=False,
                 host='0.0.0.0',  
                 port=port,
                 allow_unsafe_werkzeug=True)