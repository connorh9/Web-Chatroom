import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from 'react';
import ClassSelection from "../ClassSelection/ClassSelection.jsx";
import WelcomeScreen from "./pages/WelcomeScreen.jsx";
import ChatroomScreen, {ChatRoom , ChatPlaceholder} from "./pages/ChatroomScreen.jsx";


export default function WebAppRouter(){
    const [classes, setClasses] = useState([])

    const handleClassSubmit = async (newClasses) => {
    //POST classrooms to database here
        try{
            const response = await fetch('http://127.0.0.1:5000/chatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {names: newClasses}),
            });
            if(!response.ok){
                throw new Error('Failed to create chatrooms');
            }
            const data = await response.json();
            console.log("created chatrooms", data.created_chatrooms);
            setClasses(data.created_chatrooms || newClasses)
        } catch (error) {
            console.error('Error creating chatrooms:', error);
        }
        
    }
    
    return <BrowserRouter>
        <Routes>
            <Route path = "/" element={<WelcomeScreen />}/>
            <Route path = "/select" element={<ClassSelection onSubmit={handleClassSubmit}/>}/>
            <Route 
                path="/chat" 
                element={
                    classes.length > 0 
                    ? <ChatroomScreen classes={classes} /> 
                    : <Navigate to="/select" replace />
                }
                >
                <Route index element={<ChatPlaceholder />} />
                <Route path=":className" element={<ChatRoom />} />
            </Route>
        </Routes>
    </BrowserRouter>
}