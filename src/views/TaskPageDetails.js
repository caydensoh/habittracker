import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, getDocs, collection, doc } from "firebase/firestore";
import { Container, ListGroup, Spinner, Nav } from "react-bootstrap";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SiteNav from "../templates/SiteNav";

export default function MainTaskDetails() {
  const [user, userloading] = useAuthState(auth);
  const [userUID, setUserUID] = useState("");
  const [userId, setUserId] = useState("");
  const { id } = useParams();
  const [mainTask, setMainTask] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/signup");
    setUserId(user.email);
    setUserUID(user.uid);
  }, [navigate, user, loading]);


  useEffect(() => {
      const getMainTask = async () => {
          try {
              const mainTaskDoc = await getDoc(doc(db, "main_tasks", id));
              if (mainTaskDoc.exists()) {
                  setMainTask({ id: mainTaskDoc.id, ...mainTaskDoc.data() });
              } else {
                  navigate("/*");
              }
          } catch (error) {
              console.error("Error fetching main task:", error);
          }
      };

      const getSubTasks = async () => {
          try {
              const query = await getDocs(collection(db, `main_tasks/${id}/sub_task`));
              const fetchedSubTasks = query.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              }));
              setSubTasks(fetchedSubTasks);
          } catch (error) {}
      };

      const fetchData = async () => {
          await getMainTask();
          await getSubTasks();
          setLoading(false);
      };

      fetchData();
  }, [id]);

  if (loading) {
      return (
        <Container className="text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
      );
  }

  return (
    <>
      <SiteNav email = {userId}/>
      <Container>
          <h2>{mainTask.task_name}</h2>
          <p><strong>Priority:</strong> {priorityReturn(mainTask.priority)}</p>
          <p><strong>Time Required:</strong> {mainTask.time_required} hours</p>
          <p><strong>Completed:</strong> {mainTask.completed ? "Yes" : "No"}</p>
          
          <h3>Subtasks</h3>
          {subTasks.length > 0 ? (
              <ListGroup>
                  {subTasks.map((subTask) => (
                      <ListGroup.Item key={subTask.id}>
                          <strong>{subTask.subtask_name}</strong> - {subTask.completed ? "Completed" : "Pending"}
                      </ListGroup.Item>
                  ))}
              </ListGroup>
          ) : (
              <p>No subtasks available.</p>
          )}
          <Nav.Item>
            <Nav.Link href={`/task/${id}/add`} eventKey="link-1">Add New Subtask</Nav.Link>
          </Nav.Item>
          
      </Container>
      </>
  );
}

function priorityReturn(priority) {
  switch(priority) {
    case 1: return 'Low';
    case 2: return 'Medium';
    case 3: return 'High';
    default: return;
  }
}