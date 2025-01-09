import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import bascomHall from '../../../images/bascom-hall.png';

export default function Chatroom() {
    const { className } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState('');
    const [chatroomId, setChatroomId] = useState(null);
    const messagesEndRef = useRef(null);

    // Socket connection setup
    useEffect(() => {
        console.log("Setting up socket connection");
        const newSocket = io('http://127.0.0.1:5000', {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
        });
        
        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        setSocket(newSocket);
        
        return () => {
            if (newSocket) {
                console.log("Cleaning up socket connection");
                newSocket.disconnect();
            }
        };
    }, []);

    // Join/leave chatroom
    useEffect(() => {
        if (socket && chatroomId) {
        socket.emit('join', { room: chatroomId.toString() });
        return () => socket.emit('leave', { room: chatroomId });
        }
    }, [socket, chatroomId]);

  // Listen for new messages
    useEffect(() => {
        console.log("Message listener triggered")
        if (socket) {
            socket.on('new_message', (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
                console.log(messages)
        });
        return () => socket.off('new_message');
        }
    }, [socket]);

    useEffect(() => {
        // Generate or retrieve userId when component mounts
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            const newUserId = uuidv4();
            localStorage.setItem('userId', newUserId);
            setUserId(newUserId);
        } else {
            setUserId(storedUserId);
        }
    }, []);

    const fetchMessages = async (chatroomId) => {
        console.log('Fetch messages', chatroomId);
        try{
            const response = await fetch(`http://127.0.0.1:5000/chatrooms/${chatroomId}/messages`, {
                method: 'GET',
            });
            if(!response.ok){
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
           // console.log('Received messages:', data);  // See what we're getting
            setMessages(data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    useEffect(() => {
        const getChatroomId = async (chatroomName) => {
            const response = await fetch(`http://127.0.0.1:5000/chatrooms/name/${chatroomName}`, {
                method: 'GET',
            });

            if(!response.ok){
                throw new Error('Failed to fetch chatroom id');
            }
            
            const data = await response.json();
            setChatroomId(data.id);
            console.log('Chatroom ID', data.id);
        }

        

        if(className){
            getChatroomId(className)
                .then(() => {
                    if (chatroomId) {
                        fetchMessages(chatroomId);
                    }
                });
        }
        console.log('Current messages:', messages);

    }, [className, chatroomId]);

    const sendMessage = async (content) => {
        const response = await fetch('http://127.0.0.1:5000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                chatroom_id: chatroomId,
                user_id: userId
            }),
        });
        if(!response.ok){
            throw new Error('Failed to send message');
        }
        const data = await response.json();
        setMessages([...messages, data]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chat Room: {decodeURIComponent(className)}</h2>
        <button
          onClick={() => navigate('/select')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Class List
        </button>
      </div>

      <div className="flex flex-col bg-gray-100 rounded-lg shadow-lg h-[75vh] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 rounded-lg"
          style={{
            backgroundImage: `url(${bascomHall})`,
            zIndex: 0
          }}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
          {messages.map((message, index) => (
            <div key={index} className={`flex flex-col ${message.user_id === userId ? 'items-end' : 'items-start'}`}>
              <span className={`text-xs text-gray-500 mb-1 ${message.user_id === userId ? 'mr-2' : 'ml-2'}`}>
                {message.user_id === userId ? 'You' : `User ${message.user_id.slice(0, 8)}`}
              </span>
              
              <div 
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.user_id === userId 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white text-black rounded-tl-none shadow'
                }`}
              >
                <p className="break-words">{message.content}</p>
                {message.timestamp && (
                  <p className={`text-xs mt-1 ${
                    message.user_id === userId 
                      ? 'text-blue-100' 
                      : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg relative z-10">
          <Form onSubmit={handleSubmit} className="flex gap-2">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500"
            />
            <Button 
              type="submit"
              variant="primary"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none"
            >
              Send
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
