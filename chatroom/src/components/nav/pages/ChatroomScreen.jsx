import { Outlet, Link } from 'react-router-dom'
import { Button } from "react-bootstrap";
import { useTheme } from '../../ThemeContext';

export default function ChatroomScreen({ classes }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-100'} p-4`}>
      {/* Theme Toggle Switch */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>☀️</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
        <span className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>🌙</span>
      </div>

      <div className="flex flex-col items-center">
        <Link to="/">
          <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
            Badger Chat
          </h1>
        </Link>
        {/* <Link to="/">
          <Button 
            className={`mb-4 px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-black hover:bg-gray-100'
            } transition-colors`}
          >
            Home
          </Button>
        </Link> */}
        
        <div className="w-full max-w-4xl flex gap-4">
          <div className={`w-1/3 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'} p-4 rounded-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              Your Classes
            </h2>
            {classes.map((cls) => (
              <Link key={cls} to={`/chat/${encodeURIComponent(cls)}`}>
                <Button
                  className={`w-full text-left px-3 py-2 mb-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-white text-black hover:bg-gray-200'
                  } transition-colors`}
                >
                  {cls}
                </Button>
              </Link>
            ))}
          </div>
          <div className={`w-2/3 ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'} p-4 rounded-lg`}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}