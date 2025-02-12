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
            // Najpierw dodajemy aktora do bazy danych
            const actorResponse = await fetch('/actors', {
                method: 'POST',
                body: JSON.stringify(actor),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!actorResponse.ok) {
                throw new Error('Błąd podczas dodawania aktora');
            }
            // Pobieramy dane dodanego aktora, aby uzyskać jego ID
            const newActor = await actorResponse.json();
            
            // Teraz przypisujemy aktora do filmu
            const addActorToMovieResponse = await fetch(`/movies/${movieId}/actors `, {
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

    // const handleActorSubmit = async (actor) => {
    //     if (isLoading) return;
    //     setLoading(true);

    //     try {
    //         // Najpierw sprawdzamy, czy aktor już istnieje w bazie danych
    //         const existingActorResponse = await fetch(`/actors?name=${actor.name}&surname=${actor.surname}`);
    //         if (existingActorResponse.ok) {
    //             const existingActor = await existingActorResponse.json();
    //             if (existingActor.length > 0) {
    //                 // Jeśli aktor już istnieje, używamy jego ID do przypisania do filmu
    //                 const movieActorsResponse = await fetch(`/movies/${movieId}/actors`);
    //                 if (movieActorsResponse.ok) {
    //                     const movieActors = await movieActorsResponse.json();
    //                     const isActorAssigned = movieActors.some((movieActor) => movieActor.id === existingActor[0].id);

    //                     if (isActorAssigned) {
    //                         alert('Aktor już jest przypisany do tego filmu');
    //                         return;
    //                     }
    //                 }
    //                  // Aktor istnieje, ale nie jest przypisany do tego filmu - przypisujemy go
    //                  await assignActorToMovie(existingActor[0].id);
    //                  return;
    //              }
    //          }

    //         // Jeśli nie istnieje to dodajemy aktora do bazy danych
    //         const actorResponse = await fetch('/actors', {
    //             method: 'POST',
    //             body: JSON.stringify(actor),
    //             headers: { 'Content-Type': 'application/json' }
    //         });

    //         if (!actorResponse.ok) {
    //             throw new Error('Błąd podczas dodawania aktora');
    //         }

    //         // Pobieramy dane dodanego aktora, aby uzyskać jego ID
    //         const newActor = await actorResponse.json();
    //         await assignActorToMovie(newActor.id);

    //     } catch (error) {
    //         alert('Błąd sieci: ' + error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    
    // const assignActorToMovie = async (actorId) => {
    //     try {
    //         // Teraz przypisujemy aktora do filmu
    //         const addActorToMovieResponse = await fetch(`/movies/${movieId}/actors`, {
    //             method: 'POST',
    //             body: JSON.stringify({ actor_id: actorId }),
    //             headers: { 'Content-Type': 'application/json' }
    //         });

    //         if (!addActorToMovieResponse.ok) {
    //             throw new Error('Błąd podczas przypisywania aktora do filmu');
    //         }

    //         alert('Aktor dodany i przypisany do filmu pomyślnie');
    //         fetchMovies();
    //         navigate("/");

    //     } catch (error) {
    //         alert('Błąd sieci: ' + error.message);
    //     }
    // };

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
