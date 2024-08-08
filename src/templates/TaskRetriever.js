import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase"; 
// Function to fetch all main tasks for a given user UID
export async function getAllMainTasks(userUID) {
    if (userUID) {
        const q = await getDocs(query(collection(db, "main_tasks"), where("user_uid", "==", userUID)));
        return q.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
    }
    else {
        return undefined;
    }
}

export async function getMainTask(taskID) {
    if (taskID) {
        const q = await getDocs(query(collection(db, "main_tasks",taskID)));
        if (q.exists()) {
            return q.docs.map((doc) => { console.log(doc.task_name);
                return { id: doc.id, ...doc.data() };
            });
        }
        else {
            return 'no entry';
        }
        
    }
    else {
        return undefined;
    }
}

// Function to fetch all subtasks for a given main task ID
export async function getSubTasks(mainTaskId) {
    if (mainTaskId) {
        const querySnapshot = await getDocs(collection(db, `main_tasks/${mainTaskId}/sub_task`));
        return querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
    }
    else {
        return undefined;
    }
}