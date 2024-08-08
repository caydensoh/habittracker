import React, { useEffect, useState } from "react";
import { Button, Container, Dropdown, ButtonGroup, DropdownMenu, Spinner } from "react-bootstrap";
import SiteNav from "../templates/SiteNav";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getAllMainTasks, getSubTasks } from "../templates/TaskRetriever";

export default function HomePage() {
    const [user, loading] = useAuthState(auth);
    const [userUID, setUserUID] = useState("");
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    const [mainTasks, setMainTasks] = useState([]);

    useEffect(() => { //fetches main tasks
        const fetchTasks = async () => {
            if (userUID) {
                const fetchedMainTasks = await getAllMainTasks(userUID);
                setMainTasks(fetchedMainTasks);
            }
        };
        fetchTasks();
    }, [userUID]);

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

    const TaskRow = () => {
        return mainTasks.map((main_task, index) => <><MainTaskDropdown key = {index} mainTask={main_task}/><p></p></> )
    }
    
    return (
        <>
        <SiteNav email={userId}/>
        <Container>
            <TaskRow />
        </Container>
        </>  
    )
}

function MainTaskDropdown({ mainTask }) { //creates a single dropdown entry for the specified task
    const [subTasks, setSubTasks] = useState([]);
    const { task_name, id, time_required, priority, completed } = mainTask;
    useEffect(() => {
        const fetchSubTasks = async () => {
            const fetchedSubTasks = await getSubTasks(id);
            setSubTasks(fetchedSubTasks);
        };
        fetchSubTasks();
    }, [id]);

    
    return (
        <Dropdown as={ButtonGroup} className="mb-2">
            <Button variant={getButtonVariant(priority, completed)} href={`task/${id}`}>
                {`${task_name} - ${time_required} hours`}
            </Button>

            <Dropdown.Toggle split variant={getButtonVariant(priority, completed)} id="dropdown-split-basic" />

            <DropdownMenu>
                {subTasks.length > 0 ? (
                    subTasks.map((doc) => (
                        <Dropdown.Item
                            key={doc.id}
                            style={{ backgroundColor: getSubtaskColor(doc.priority, doc.completed) }}
                        >
                            {`${doc.subtask_name} - ${doc.time_required} hours`}
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item>No subtasks available</Dropdown.Item>
                )}
            </DropdownMenu>
        </Dropdown>
    );
}

const getButtonVariant = (priority, completed) => { //formatting
    if (completed) {
        return "secondary"; // Grey for completed tasks
    }
    switch (priority) {
        case 1:
            return "success"; // Green for priority 1
        case 2:
            return "warning"; // Yellow for priority 2
        case 3:
            return "danger"; // Red for priority 3
        default:
            return "primary"; // Default color
    }
};

function getSubtaskColor(priority, completed) { //formatting
    if (completed) {
        return "grey"; // Grey for completed subtasks
    }
    switch (priority) {
        case 1:
            return "green"; // Green for priority 1
        case 2:
            return "yellow"; // Yellow for priority 2
        case 3:
            return "red"; // Red for priority 3
        default:
            return "white"; // Default color
    }
}