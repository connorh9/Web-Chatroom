import { Outlet, Link } from 'react-router-dom'
import { Button } from "react-bootstrap";

export default function ChatroomScreen({ classes }) {
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}