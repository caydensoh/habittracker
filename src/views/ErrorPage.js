import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/"); // Redirects to the homepage
    };

    return (
        <Container className="text-center mt-5">
            <h1>Oops!</h1>
            <p>We can't seem to find the page you're looking for.</p>
            <Button variant="primary" onClick={handleBackToHome}>
                Back to Home
            </Button>
        </Container>
    );
}