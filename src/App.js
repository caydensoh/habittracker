import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignUpPage";
import TaskPageAdd from "./views/TaskPageAdd";
import TaskPageDetails from "./views/TaskPageDetails";
import ErrorPage from "./views/ErrorPage";
//import PostPageUpdate from "./views/PostPageUpdate";//*/


function App() {

  const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/add", element: <TaskPageAdd /> },
    { path: "/task/:id", element: <TaskPageDetails /> },
    //{ path: "/update/:id", element: <PostPageUpdate /> }//*/
    { path: "/*", element: <ErrorPage />}
  ]);
  
  return (
    <RouterProvider router={router} />
  );
}


export default App;
