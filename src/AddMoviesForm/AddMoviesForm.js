import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import "./AddMoviesForm.css";

function AddMoviesForm(props) {
    const [title, setTitle] = useState("");
    const [openingText, setOpeningText] = useState("");
    const [releaseDate, setReleaseDate] = useState("");

    async function addMovieHandler(event) {
    event.preventDefault();
    const newMovie = { title, openingText, releaseDate };

    try {
        const response = await fetch(
            "https://movies-list-73a50-default-rtdb.firebaseio.com/movies.json",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMovie),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add movie");
        }

        const savedMovie = await response.json(); // { name: "-Mxyz123abc" }

        const movieWithId = {
            id: savedMovie.name,
            ...newMovie,
        };

        props.onAddMovie(movieWithId);

        // Reset form
        setTitle("");
        setOpeningText("");
        setReleaseDate("");
    } catch (error) {
        console.error(error);
    }
}


    return (
        <Container className="form-container">
            <Card className="form-card">
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter movie title"
                                className="input-field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Opening Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter opening text"
                                className="input-field"
                                value={openingText}
                                onChange={(e) => setOpeningText(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Release Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="YYYY-MM-DD"
                                className="input-field"
                                value={releaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button
                                variant="dark"
                                type="submit"
                                className="add-btn fw-semibold"
                                onClick={addMovieHandler}
                            >
                                Add Movie
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AddMoviesForm;
