import { useNavigate } from "react-router-dom";

export default function MovieListItem(props) {
    const navigate = useNavigate();

    const handleAddActorClick = () => {
        navigate(`/add-actor/${props.movie.id}`);

    };
    return (
        <div>
            <div>
                
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                directed by {props.movie.director}
                {' '}
                <a 
                    className="delete-link"
                    onClick={props.onDelete}>Delete movie</a>
                {' '}
                <a 
                    className="add-actor-link"
                    onClick={handleAddActorClick}>Add actor</a>
                
            </div>
            <div>
                actors: {props.movie.actors && props.movie.actors.length > 0 ? 
                props.movie.actors.map(actor => `${actor.name} ${actor.surname}`).join(", ") : 
                "brak danych"}
            </div>
            <div>
                {props.movie.description}
            </div>


            
        </div>
    );
}
