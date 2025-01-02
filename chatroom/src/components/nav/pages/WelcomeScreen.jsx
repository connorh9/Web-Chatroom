import React from "react";
import { Row, Col, Pagination, Container, Button, Form } from "react-bootstrap";
import { Link, Outlet, useNavigate } from 'react-router-dom';


function WelcomeScreen(){
    const navigate = useNavigate();

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-6 text-red-600">Welcome to Badger Chat</h1>
      <p className="text-xl mb-8 text-center max-w-md text-gray-600">
        Connect with your classmates and join discussions for your courses.
      </p>
      <Link to="/select">
        <Button size="lg" className="text-lg px-8 py-6">
          Get Started
        </Button>
      </Link>
    </div>
    )
}

export default WelcomeScreen;

