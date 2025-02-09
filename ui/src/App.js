import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import AddActorPage from "./AddActorPage";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);


    useEffect(()=> {
      const fetchMovies = async () => {
        const response = await fetch (`/movies`);
        
        if (response.ok) {
          const movies = await response.json();
          setMovies(movies);
          console.log(movies);
        }

      };
      fetchMovies();
    }, []);

    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const movieFromServer = await response.json();
          setMovies([...movies, movieFromServer]);
          setAddingMovie(false);
        }
      }
  

    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`,{
          method: 'DELETE',
        });
        if (response.ok) {
          const filteredMovies= movies.filter(m => m !== movie);
          setMovies(filteredMovies);
        }
    }

       return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="container">
                        <h1>My favourite movies to watch</h1>
                        {movies.length === 0
                            ? <p>No movies yet. Maybe add something?</p>
                            : <MoviesList movies={movies}
                                          onDeleteMovie={(movie) => handleDeleteMovie(movie)}
                            />}
                        {addingMovie
                            ? <MovieForm onMovieSubmit={handleAddMovie}
                                         buttonLabel="Add a movie"
                            />
                            : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
                            
                    </div>
                } />
                <Route path="/add-actor/:movieId" element={<AddActorPage />} />
                {/* inne trasy... */}
            </Routes>
        </Router>
    );
}

export default App;