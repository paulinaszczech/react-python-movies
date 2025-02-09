// ActorsList.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

function ActorsList() {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActors = async () => {
      const response = await fetch('/actors');
      if (response.ok) {
        const actors = await response.json();
        setActors(actors);
      }
    };
    fetchActors();
  }, []);

  return (
    <div>
      <h2>List of Actors</h2>
      {actors.length === 0 ? (
        <p>No actors found.</p>
      ) : (
        <ul>
          {actors.map((actor) => (
            <li key={actor.id}>{actor.name}  {actor.surname}</li>
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
