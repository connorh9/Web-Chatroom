import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

export default function Chatroom() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatroomId, setChatroomId] = useState(null);
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState(null);
    const { chatroom } = useParams();

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://127.0.0.1:5000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    // Join/leave chatroom when chatroomId changes
    useEffect(() => {
        if (socket && chatroomId) {
            socket.emit('join', { room: chatroomId });

            return () => {
                socket.emit('leave', { room: chatroomId });
            };
        }
    }, [socket, chatroomId]);

    // Listen for new messages
    useEffect(() => {
        if (socket) {
            socket.on('new_message', (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                socket.off('new_message');
            };
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
        }

        const fetchMessages = async (chatroomId) => {
            try{
                const response = await fetch(`http://127.0.0.1:5000/chatrooms/${chatroomId}/messages`, {
                    method: 'GET',
                });
                if(!response.ok){
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(data.messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        if(chatroom){
            getChatroomId(chatroom)
                .then(() => {
                    if (chatroomId) {
                        fetchMessages(chatroomId);
                    }
                });
        }

    }, [chatroom]);

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

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen">
            <h1 className="text-2xl font-bold mb-4">{chatroom}</h1>
            
            <div className="flex-1 overflow-y-auto mb-4">
                <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                    message.user_id === userId 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                <p className="break-words">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                    message.user_id === userId 
                                        ? 'text-blue-100' 
                                        : 'text-gray-500'
                                }`}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    Send
                </button>
            </form>
        </div>
        /*
        <Form onSubmit={handleSubmit} className="flex gap-2">
                <Form.Control
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Button 
                    type="submit"
                    variant="primary"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none"
                >
                    Send
                </Button>
            </Form>*/
    );
}
