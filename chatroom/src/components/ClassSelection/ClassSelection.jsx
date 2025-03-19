import React, { useState } from 'react';
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import './ClassSelection.css';

function ClassSelection({ onSubmit }) {
    const [classes, setClasses] = useState([""]);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    const handleAddClass = () => {
        setClasses([...classes, ""]);
    };

    const handleRemoveClass = () => {
        if (classes.length > 1) {
            setClasses(classes.slice(0, -1))
        }
    };

    const handleClassChange = (index, value) => {
        const newClasses = [...classes];
        newClasses[index] = value;
        setClasses(newClasses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const filteredClasses = classes.filter(c => c.trim() !== '')
        try {
            await onSubmit(filteredClasses)
            navigate("/chat")
        } catch (error) {
            console.error('Error submitting classes:', error);
        }
    };

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
                <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                    Please enter your class names into the boxes!
                </h1>
                
                <Form onSubmit={handleSubmit} className="max-w-md space-y-4 w-full">
                    {classes.map((className, index) => (
                        <div key={index}>
                            <Form.Control
                                id={`Class${index}`}
                                value={className}
                                onChange={(e) => handleClassChange(index, e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 
                                    ${darkMode 
                                        ? 'bg-[#1E1E1E] text-white border-gray-600' 
                                        : 'bg-white text-black border-gray-300'}`}
                                placeholder={`Class ${index + 1}`}
                            />
                        </div>
                    ))}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleAddClass}
                            className={`px-4 py-2 rounded-lg ${
                                darkMode 
                                    ? 'bg-gray-800 text-white' 
                                    : 'bg-white text-black border-2 border-uw-red'
                            } ${
                                classes.length === 4 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : darkMode 
                                        ? 'hover:bg-uw-red' 
                                        : 'hover:bg-uw-red hover:text-white'
                            } transition-colors`}
                            disabled={classes.length === 4}
                        >
                            Add Class
                        </Button>
                        <Button
                            onClick={handleRemoveClass}
                            className={`px-4 py-2 rounded-lg ${
                                darkMode 
                                    ? 'bg-gray-800 text-white' 
                                    : 'bg-white text-black border-2 border-uw-red'
                            } ${
                                classes.length === 1 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : darkMode 
                                        ? 'hover:bg-uw-red' 
                                        : 'hover:bg-uw-red hover:text-white'
                            } transition-colors`}
                            disabled={classes.length === 1}
                        >
                            Remove Class
                        </Button>
                        <Button
                            type="submit"
                            className={`px-4 py-2 rounded-lg ${
                                darkMode 
                                    ? 'bg-gray-800 text-white hover:bg-gray-200' 
                                    : 'bg-gray-800 text-white hover:bg-gray-600'
                            } transition-colors`}
                        >
                            Submit Classes
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default ClassSelection;