from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from schemas import ActorToMovie

import schemas
import models

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    movie = models.Movie.create(**movie.dict())
    return movie


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def delete_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db_movie.delete_instance()
    return db_movie


# Endpoint to get all actors 
@app.get("/actors/", response_model=List[schemas.Actor])
def get_actors():
    """
    Retrieve all actors from the database.
    Returns a list of actors.
    """
    return list(models.Actor.select())


# Endpoint to get a single actor by their ID
@app.get("/actors/{actor_id}", response_model=schemas.Actor)
def get_actor(actor_id: int):
    """
    Retrieve an actor by its ID.
    Return the actor if found, raises 404 otherwise.
    """
    actor = models.Actor.get_or_none(models.Actor.id == actor_id)
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return actor


# Endpoint to add a new actor to the database
@app.post("/actors/", response_model=schemas.Actor)
def add_actor(actor: schemas.ActorCreate):
    """
    Add a new actor to the database.
    Return the added actor.
    """
    actor = models.Actor.create(**actor.dict())
    return actor


# Endpoint to delete an actor by their ID
@app.delete("/actors/{actor_id}", response_model=schemas.Actor)
def delete_actor(actor_id: int):
    """
    Delete an actor by its ID.
    Return the deleted actor if found, raises 404 otherwise.
    """
    actor = models.Actor.get_or_none(models.Actor.id == actor_id)
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    actor.delete_instance()
    return actor


# Endpoint to add an actor to a movie by their IDs
@app.post("/movies/{movie_id}/actors", response_model=schemas.Movie)
def add_actor_to_movie(movie_id: int, actor_data: ActorToMovie):
    """
    Add a new actor to a movie.
    Returns the updated movie.
    """
    actor_id = actor_data.actor_id  # Get actor_id from body

    movie = models.Movie.get_or_none(models.Movie.id == movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    actor = models.Actor.get_or_none(models.Actor.id == actor_id)
    if actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    if actor in movie.actors:
        raise HTTPException(status_code=409, detail="Actor already assigned to this movie")

    movie.actors.add(actor)
    return movie
