import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from 'react';
import ClassSelection from "../ClassSelection/ClassSelection.jsx";
import WelcomeScreen from "./pages/WelcomeScreen.jsx";
import ChatroomScreen, {ChatRoom , ChatPlaceholder} from "./pages/ChatroomScreen.jsx";
import Chatroom from './pages/Chatroom';

const API_URL = process.env.REACT_APP_API_URL || 'https://chatroom-518233057279.us-central1.run.app';

export default function WebAppRouter(){
    const [classes, setClasses] = useState([])

    const handleClassSubmit = async (newClasses) => {
        try {
            console.log('Submitting to:', `${API_URL}/chatrooms`); // Debug log
            const response = await fetch(`${API_URL}/chatrooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ names: newClasses }),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to create chatrooms: ${response.status} ${errorData.message || response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Created chatrooms:", data.created_chatrooms);
            setClasses(newClasses);
            return data;
        } catch (error) {
            console.error('Error creating chatrooms:', error);
            throw error; //Re-throw to handle in ClassSelection
        }
    }
    
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<WelcomeScreen />}/>
            <Route path="/select" element={<ClassSelection onSubmit={handleClassSubmit}/>}/>
            <Route 
                path="/chat" 
                element={
                    classes.length > 0 
                    ? <ChatroomScreen classes={classes} /> 
                    : <Navigate to="/select" replace />
                }
            >
                <Route index element={<div className="text-center text-gray-500">Select a class to start chatting</div>} />
                <Route path=":className" element={<Chatroom />} />
            </Route>
        </Routes>
    </BrowserRouter>
}