import { useParams, useNavigate } from "react-router-dom";
import ActorForm from "./ActorForm";

export default function AddActorPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const handleActorSubmit = async (actor) => {
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
            const addActorToMovieResponse = await fetch(`/movies/${movieId}/actors`, {
                method: 'POST',
                body: JSON.stringify({ actor_id: newActor.id }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!addActorToMovieResponse.ok) {
                throw new Error('Błąd podczas przypisywania aktora do filmu');
            }

            alert('Aktor dodany i przypisany do filmu pomyślnie');
        } catch (error) {
            alert('Błąd sieci: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Add Actor for ID {movieId}</h2>
            <ActorForm onActorSubmit={handleActorSubmit} />
            <button onClick={() => navigate("/")}>Back</button> {/* Dodany przycisk Back */}
        </div>
    );
}
