import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClassSelection from "../ClassSelection/ClassSelection.jsx";
import WelcomeScreen from "./pages/WelcomeScreen.jsx";
import ChatroomScreen from "./pages/ChatroomScreen.jsx";


export default function WebAppRouter(){
    return <BrowserRouter>
        <Routes>
            <Route path = "/" element={<WelcomeScreen />}/>
            <Route path = "/select" element={<ClassSelection />}/>
            <Route path = "/chat/*" element={<ChatroomScreen /> }/>
        </Routes>
    </BrowserRouter>
}