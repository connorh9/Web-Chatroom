import React, { useEffect, useState, useRef, useContext } from 'react';
import { Row, Col, Pagination, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './ClassSelection.css';

function ClassSelection( {onSubmit} ){
    const [classes, setClasses] = useState([""]);
    const navigate = useNavigate();
    

    const handleAddClass = () =>{
        console.log("Add")
        setClasses([...classes, ""]);
    };

    const handleRemoveClass = () => {
        console.log("Remove")
        if (classes.length > 1) {
            setClasses(classes.slice(0, -1))
        }
    };

    const handleClassChange = (index, value) => {
        const newClasses = [...classes];
        newClasses[index] = value;
        setClasses(newClasses);
    };

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const filteredClasses = classes.filter(c => c.trim() !== '')
        console.log(filteredClasses)
        try {
            await onSubmit(filteredClasses)
            navigate("/chat")//, { state: {classes: filteredClasses}})
        } catch (error) {
            console.error('Error submitting classes:', error);
        }
        
        
    };

    return(
        <div className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Please enter your class names into the boxes!</h1>                
                <Form onSubmit={handleSubmit} className="max-w-md space-y-4">
                    {classes.map((className, index) => (
                        <div key={index}>
                            <Form.Control
                                id={`Class${index}`}
                                value={className}
                                onChange={(e) => handleClassChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                placeholder={`Class ${index+1}`}
                            />
                        </div>
                    ))}
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={handleAddClass} 
                            className="px-4 py-2 text-black rounded-lg hover:bg-gray-100"
                            disabled={classes.length == 4}
                        >
                            Add Class
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleRemoveClass}
                            className="px-4 py-2 text-black rounded-lg hover:bg-gray-100"
                            disabled={classes.length === 1} 
                        >
                            Remove Class
                        </Button>
                        <Button 
                            type="submit" 
                            className="px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
                        >Submit Classes</Button>
                    </div>
                </Form>
        </div>
    )
}

export default ClassSelection;