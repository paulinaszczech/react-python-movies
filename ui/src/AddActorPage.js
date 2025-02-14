import { useParams, useNavigate } from "react-router-dom";
import ActorForm from "./ActorForm";
import { useState } from "react";

export default function AddActorPage({ fetchMovies }) {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);

    const handleActorSubmit = async (actor) => {
        if (isLoading) return;
        setLoading(true);

        try {
            // Add new actor to DB
            const actorResponse = await fetch('/actors', {
                method: 'POST',
                body: JSON.stringify(actor),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!actorResponse.ok) {
                throw new Error('Error while adding the actor');
            }
            const newActor = await actorResponse.json();
            console.log("New actor added:", newActor);

            // Add actor to movie
            const addActorToMovieResponse = await fetch(`/movies/${movieId}/actors`, {
                method: 'POST',
                body: JSON.stringify({ actor_id: newActor.id }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!addActorToMovieResponse.ok) {
                throw new Error('Error while assigning the actor to the movie');
            }

            alert('The actor has been successfully added and assigned to the movie');
            fetchMovies();
            navigate("/");
            setLoading(false);

        } catch (error) {
            setLoading(false);
            alert('Network error: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h2>Add Actor for ID {movieId}</h2>
            <ActorForm onActorSubmit={handleActorSubmit} />
            <button 
                className="button" 
                onClick={() => navigate("/")}
                disabled={isLoading} 
            >
                {isLoading ? "Loading..." : "Back"}
            </button>
        </div>
    );
}
