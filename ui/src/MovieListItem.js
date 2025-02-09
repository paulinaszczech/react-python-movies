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
                <a onClick={props.onDelete}>Delete</a>
                {' '}
                <a onClick={handleAddActorClick}>Actor</a>
            </div>
            {props.movie.description}
        </div>
    );
}
