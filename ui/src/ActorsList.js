// ActorsList.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

function ActorsList({onDeleteActor}) {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActors = async () => {
      const response = await fetch('/actors');
      if (response.ok) {
        const actors = await response.json();
        console.log(actors);
        setActors(actors);
      }
    };
    fetchActors();
  }, []);

  const handleDeleteClick = (actorId) => {
    if (onDeleteActor) {
      onDeleteActor(actorId);
    }

    const updatedActors = actors.filter(actor => actor.id !== actorId);
    setActors(updatedActors);
  };

  return (
    <div className="container">
      <h2>List of Actors</h2>
      {actors.length === 0 ? (
        <p>No actors found.</p>
      ) : (
        <ul>
          {actors.map((actor) => (
            <li key={actor.id}>
              {actor.name}  {actor.surname}
              <span 
                onClick={() => handleDeleteClick(actor.id)} 
                className="delete-link">
                Delete
              </span>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/')} className="button">
        Back
      </button>
    </div>
  );
}

export default ActorsList;
