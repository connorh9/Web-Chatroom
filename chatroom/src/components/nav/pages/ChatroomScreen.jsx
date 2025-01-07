import { Outlet, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { Row, Col, Pagination, Container, Button, Form } from "react-bootstrap";
import { useState, useEffect } from 'react';


export default function ChatroomScreen( {classes} ) {
  //const navigation = useNavigation();
  const [selectedClass, setSelectedClass] = useState(null)
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentChatroom, setCurrentChatroom] = useState(null);

  // const handleClassSelect = (className) => {
  //   setSelectedClass(className)
  // }
  // const location = useLocation();
  // const classes = location.state?.classes || [];

  useEffect(() => {
    async function fetchChatrooms(){
      try{
        const response = await fetch('http://127.0.0.1:5000/chatrooms', {
          method: 'GET',
        });
        if(!response.ok){
          throw new Error('Failed to fetch chatrooms');
        }
        const data = await response.json();
        setChatrooms(data.chatrooms);
      } catch (error) {
        console.error('Error fetching chatrooms:', error);
      }
    }
    fetchChatrooms();
  }, []);

  

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Badger Chat</h1>
        <Link to="/">
          <Button variant="ghost" className="text-white hover:text-blue-200">Home</Button>
        </Link>
      <div className="w-full max-w-4xl flex gap-4">
        <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          {classes.map((cls) => (
            <Link key={cls} to={`/chat/${encodeURIComponent(cls)}`}>
              <Button
                className="w-full text-left px-3 py-2 mb-2 rounded-lg bg-white text-black hover:bg-gray-200"
              >
                {cls}
              </Button>
            </Link>
          ))}
        </div>
        <div className="w-2/3 bg-gray-100 p-4 rounded-lg">
          {/* <Routes>
            <Route path="/" element={<p className="text-center text-gray-500">Select a class to start chatting</p>} />
            <Route path=":className" element={<ChatRoom />} />
          </Routes> */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function ChatRoom() {
  const { className } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chat Room: {decodeURIComponent(className)}</h2>
        <button
          onClick={() => navigate('/chat')}
          className="px-4 py-2 text-black rounded-lg hover:bg-gray-200"
        >
        {/*Logic for getting chatrooms and messages here*/}
          Back to Class List
        </button>
      </div>
      <p className="text-gray-600">Chat messages for {decodeURIComponent(className)} would appear here.</p>
    </div>
  )
}

export function ChatPlaceholder() {
  return <p className="text-center text-gray-500">Select a class to start chatting</p>
}