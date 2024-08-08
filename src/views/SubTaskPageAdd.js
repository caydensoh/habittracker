
import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 

export default function AddSubtaskForm() {
    const [subtaskName, setSubtaskName] = useState("");
    const [priority, setPriority] = useState(1);
    const [mainTasks, setMainTasks] = useState([]);
    const [selectedMainTask, setSelectedMainTask] = useState("");

    useEffect(() => {
        const fetchMainTasks = async () => {
            const querySnapshot = await getDocs(collection(db, "main_tasks"));
            const tasks = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMainTasks(tasks);
        };

        fetchMainTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMainTask) {
            alert("Please select a main task to add the subtask to.");
            return;
        }

        try {
            const subTaskDocRef = await addDoc(collection(db, `main_tasks/${selectedMainTask}/sub_task`), {
                subtask_name: subtaskName,
                priority: priority,
                completed: false,
            });
            console.log("Subtask added with ID: ", subTaskDocRef.id);

            // Reset form fields
            setSubtaskName("");
            setPriority(1);
        } catch (e) {
            console.error("Error adding subtask: ", e);
        }
    };

    return (
        <Container>
            <h2>Add Subtask</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="mainTask">
                    <Form.Label>Main Task</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedMainTask}
                        onChange={(e) => setSelectedMainTask(e.target.value)}
                    >
                        <option value="">Select a main task</option>
                        {mainTasks.map((task) => (
                            <option key={task.id} value={task.id}>
                                {task.task_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

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
                        <option value={1}>1 (High)</option>
                        <option value={2}>2 (Medium)</option>
                        <option value={3}>3 (Low)</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add Subtask
                </Button>
            </Form>
        </Container>
    );
}