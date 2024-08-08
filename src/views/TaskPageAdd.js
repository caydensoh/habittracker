import React, { useState, useEffect } from "react";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SiteNav from "../templates/SiteNav";


export default function TaskPageAdd() {
    const [user, loading] = useAuthState(auth);
    const [userUID, setUserUID] = useState("");
    const [userId, setUserId] = useState("");
    const [taskName, setTaskName] = useState("");
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

    async function addTask() {
        await addDoc(collection(db, "main_tasks"), {
            task_name: taskName,
            priority: priority,
            time_required: timeRequired,
            completed: false,
            user_uid: userUID, 
        });
        navigate("/");
    };

    return (
        <>
        <SiteNav email={userId}/>
        <Container>
            <h2>Add Main Task</h2>
            <Form>
                <Form.Group controlId="taskName">
                    <Form.Label>Task Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task name"
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
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
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

                <Button variant="primary" onClick={async (e) => addTask()}>
                    Add Task
                </Button>
            </Form>
        </Container>
        </>
    );
}