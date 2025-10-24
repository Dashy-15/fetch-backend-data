import React, { useState } from "react";
import "./MoviesPage.css";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = () => {
    setIsLoading(true);
    setError(null);

    fetch("https://swapi.dev/api/films/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        return response.json();
      })
      .then((data) => {
        const transformedMovies = data.results.map((movieData) => ({
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        }));
        setMovies(transformedMovies);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="movies-container">
      <div className="fetch-section">
        <button className="fetch-btn" onClick={fetchMoviesHandler}>
          Fetch Movies
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && movies.length > 0 && (
        <ul className="movies-list">
          {movies.map((movie) => (
            <li className="movie-card" key={movie.id}>
              <h2 className="movie-title">{movie.title}</h2>
              <h3 className="movie-date">{movie.releaseDate}</h3>
              <p className="movie-description">{movie.openingText}</p>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !error && movies.length === 0 && <p>No movies found.</p>}
    </div>
  );
}

export default MoviesPage;
