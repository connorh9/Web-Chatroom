import React, { useEffect, useState, useRef, useContext } from 'react';
import { Row, Col, Pagination, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './ClassSelection.css';

function ClassSelection( {onSubmit} ){
    const [classes, setClasses] = useState([""]);
    const navigate = useNavigate();
    

    const handleAddClass = () =>{
        setClasses([...classes, ""]);
    };

    const handleRemoveClass = () => {
        setClasses(classes.slice(0, -1));
    };

    const handleClassChange = (index, value) => {
        const newClasses = [...classes];
        newClasses[index] = value;
        setClasses(newClasses);
    };

    const handleSubmit = (e) =>{
        e.preventDefault()
        const filteredClasses = classes.filter(c => c.trim() !== '')
        console.log(filteredClasses)
        if(filteredClasses){
            navigate("/chat", { state: {classes: filteredClasses}})
        }
    };

    return(
        <>
            <h1 style={{textAlign:'center', marginBottom:'20px'}}>Please enter your class names into the boxes!</h1>                
                <Form onSubmit={handleSubmit} className="space-y-4">
                    {classes.map((className, index) => (
                        <div className='w-full' key={index}>
                            <Form.Control
                                id={`Class${index}`}
                                value={className}
                                onChange={(e) => handleClassChange(index, e.target.value)}
                                className='large-input'
                                placeholder={`Class ${index+1}`}
                            />
                        </div>
                    ))}
                    <Button 
                        variant="outline" 
                        onClick={handleAddClass} 
                        style={{ marginTop: '20px' }}
                        disabled={classes.length == 4}
                    >
                        Add Class
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleRemoveClass}
                        style={{ marginTop: '20px'}}
                        disabled={classes.length === 1} 
                    >
                        Remove Class
                    </Button>
                    <Button type="submit">Submit Classes</Button>
                </Form>
        </>
    )
}

export default ClassSelection;