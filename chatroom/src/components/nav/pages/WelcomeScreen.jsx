import React from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from 'react-router-dom';
import bascomHall from '../../../images/bascom-hall.png';
import { useTheme } from '../../ThemeContext';

function WelcomeScreen() {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-gray-100'} flex items-center justify-center p-4`}>
            {/* Custom Theme Toggle Switch */}
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

            <div className="max-w-3xl w-full">
                <div className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-lg overflow-hidden shadow-2xl`}>
                    <div className="relative">
                        <img
                            src={bascomHall}
                            alt="Bascom Hall"
                            className="w-full h-[300px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <h1 className="text-white text-4xl sm:text-5xl font-bold text-center px-4">
                                Welcome to Badger Chat
                            </h1>
                        </div>
                    </div>

                    <div className={`p-8 text-center ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                        <p className="text-xl mb-8">
                            Connect with fellow Badgers in real-time!
                        </p>
                        <Link to="/select">
                            <Button 
                                className={`${
                                    darkMode 
                                        ? 'bg-red-700 hover:bg-red-800' 
                                        : 'bg-uw-red hover:bg-red-700'
                                } text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300`}
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;

