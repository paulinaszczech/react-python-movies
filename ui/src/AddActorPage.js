import { useParams, useNavigate } from "react-router-dom";
import ActorForm from "./ActorForm";
import { useState } from "react";

export default function AddActorPage({fetchMovies}) {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);

    
    const handleActorSubmit = async (actor) => {
        if (isLoading) return;
        setLoading(true);

        try {
            // Verify actor in DB 
            const existingActorResponse = await fetch(`/actors?name=${actor.name}&surname=${actor.surname}`);
            let newActor;

            if (existingActorResponse.ok) {
                const existingActor = await existingActorResponse.json();
                if (existingActor.length > 0) {
                    console.log("Existing actor found:", existingActor[0]);
                    
                        // More precise comparison, ignoring case and whitespace.
                        newActor = existingActor.find((existingActor) =>
                            existingActor.name.trim().toLowerCase() === actor.name.trim().toLowerCase() &&
                            existingActor.surname.trim().toLowerCase() === actor.surname.trim().toLowerCase()
                        );
        
                        if (newActor) {
                            console.log("Existing actor found:", newActor);
                        } else {
                            console.log("No exact match found, possibly due to data inconsistencies.");
                        }
                    }
                }

            // Added new actor to DB
            if (!newActor) {
                const actorResponse = await fetch('/actors', {
                    method: 'POST',
                    body: JSON.stringify(actor),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!actorResponse.ok) {
                    throw new Error('Error while adding the actor');
                }
                newActor = await actorResponse.json();
                console.log("New actor added:", newActor);
            }

            // Checking if the actor is already assigned to the movie
            const movieActorsResponse = await fetch(`/movies/${movieId}/actors`);
            if (movieActorsResponse.ok) {
                const movieActors = await movieActorsResponse.json();
                console.log("Current actors in movie:", movieActors);
                const isActorAssigned = movieActors.some((movieActor) => movieActor.id === newActor.id);
 
                if (isActorAssigned) {
                    alert('The actor is already assigned to this movie');
                    setLoading(false);
                    return;
                }
            }
 
            console.log("Assigning actor to movie:", { actor_id: newActor.id, movie_id: movieId });

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
                {isLoading ? "Loading..." : "Back"} {/* Zmiana tekstu przycisku */}
            </button>
        </div>
    );
}
