import { Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { Row, Col, Pagination, Container, Button, Form } from "react-bootstrap";


export default function ChatroomScreen() {
  //const navigation = useNavigation();
  const location = useLocation();
  const classes = location.state?.classes || [];
  console.log(classes)
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Chat</h1>
        <Link to="/">
          <Button variant="ghost" className="text-white hover:text-blue-200">Home</Button>
        </Link>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          {classes.map((cls) => (
            <Link key={cls} to={`/chat/${encodeURIComponent(cls)}`}>
              <Button
                variant="ghost"
                className="w-full justify-start mb-2"
              >
                {cls}
              </Button>
            </Link>
          ))}
        </div>
        <div className="w-3/4 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<p className="text-center text-gray-500">Select a class to start chatting</p>} />
            <Route path=":className" element={<ChatRoom />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function ChatRoom() {
  const { className } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <Button onClick={() => navigate('/chat')} variant="outline" className="mb-4">
        Back to Class List
      </Button>
      <h2 className="text-xl font-semibold mb-4">Chat Room: {decodeURIComponent(className)}</h2>
      <p>Chat messages for {decodeURIComponent(className)} would appear here.</p>
    </div>
  )
}