
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SiteNav from "../templates/SiteNav";
import { useNavigate, useParams } from "react-router-dom";

export default function SubtaskPageAdd() {
    const { id } = useParams();
    const [user, loading] = useAuthState(auth);
    const [userUID, setUserUID] = useState("");
    const [userId, setUserId] = useState("");
    const [subtaskName, setSubtaskName] = useState("");
    const [priority, setPriority] = useState(1);
    const [timeRequired, setTimeRequired] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/signup");
        setUserId(user.email);
        setUserUID(user.uid);
    }, [navigate, user, loading]);

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const subTaskDocRef = await addDoc(collection(db, `main_tasks/${id}/sub_task`), {
                subtask_name: subtaskName,
                priority: priority,
                completed: false,
            });
            console.log("Subtask added with ID: ", subTaskDocRef.id);
            navigate(`/task/${id}`);

        } catch (e) {
            console.error("Error adding subtask: ", e);
        }
    };

    return (
        <>
        <SiteNav email={userId}/>
        <Container>
            <h2>Add Subtask</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="subtaskName">
                    <Form.Label>Subtask Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={subtaskName}
                        onChange={(e) => setSubtaskName(e.target.value)}
                        placeholder="Enter subtask name"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="priority">
                    <Form.Label>Priority</Form.Label>
                    <Form.Control
                        as="select"
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                    >
                        <option value={1}>1 (Low)</option>
                        <option value={2}>2 (Medium)</option>
                        <option value={3}>3 (High)</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="timeRequired">
                    <Form.Label>Time Required</Form.Label>
                    <Form.Control
                        type="text"
                        value={timeRequired}
                        onChange={(e) => setTimeRequired(e.target.value)}
                        placeholder="Enter time required"
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add Subtask
                </Button>
            </Form>
        </Container>
        </>
    );
}