import { Container, Nav, Navbar } from "react-bootstrap";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function SiteNav(props) {
    return (
        <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            { 
          props.email? (
            <>
                <Nav.Link href="/add">New Task</Nav.Link>
                <Nav.Link href="/">{props.email}</Nav.Link>
                <Nav.Link onClick={(e) => signOut(auth)}>🚪Sign Out</Nav.Link>
            </>
          ):(
            <>
                <Nav.Link href="/signup">Sign Up or Log In</Nav.Link>
            </>
          )
        }
          </Nav>
        </Container>
      </Navbar>
    ) 
}