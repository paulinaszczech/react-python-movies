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
                    
                        // Zmieniamy to na dokładniejsze porównanie, ignorując wielkość liter i białe znaki
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
                    throw new Error('Błąd podczas dodawania aktora');
                }
                newActor = await actorResponse.json();
                console.log("New actor added:", newActor);
            }

            // Sprawdzamy, czy aktor już jest przypisany do filmu
            const movieActorsResponse = await fetch(`/movies/${movieId}/actors`);
            if (movieActorsResponse.ok) {
                const movieActors = await movieActorsResponse.json();
                console.log("Current actors in movie:", movieActors);
                const isActorAssigned = movieActors.some((movieActor) => movieActor.id === newActor.id);
 
                if (isActorAssigned) {
                    alert('Aktor już jest przypisany do tego filmu');
                    setLoading(false);
                    return;
                }
            }
 
            // Teraz przypisujemy aktora do filmu
            console.log("Assigning actor to movie:", { actor_id: newActor.id, movie_id: movieId });

            // Add actor to movie
            const addActorToMovieResponse = await fetch(`/movies/${movieId}/actors`, {
                method: 'POST',
                body: JSON.stringify({ actor_id: newActor.id }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!addActorToMovieResponse.ok) {
                throw new Error('Błąd podczas przypisywania aktora do filmu');
            }

            alert('Aktor dodany i przypisany do filmu pomyślnie');
            fetchMovies();
            navigate("/");
            setLoading(false);

        } catch (error) {
            setLoading(false);
            alert('Błąd sieci: ' + error.message);
        }
    
    };

    return (
        <div className="container">
            <h2>Add Actor for ID {movieId}</h2>
            <ActorForm onActorSubmit={handleActorSubmit} />
            <button 
                className="button" 
                onClick={() => navigate("/")}
                disabled={isLoading} // Zablokowanie przycisku, gdy jest w trakcie ładowania
            >
                {isLoading ? "Loading..." : "Back"} {/* Zmiana tekstu przycisku */}
            </button>
        </div>
    );
}
