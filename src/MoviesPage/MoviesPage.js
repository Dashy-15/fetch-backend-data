import React, { useState, useRef } from "react";
import "./MoviesPage.css";

// function MoviesPage() {
//   const [movies, setMovies] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchMoviesHandler = () => {
//     setIsLoading(true);
//     setError(null);

//     fetch("https://swapi.dev/api/films/")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Something went wrong!");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const transformedMovies = data.results.map((movieData) => ({
//           id: movieData.episode_id,
//           title: movieData.title,
//           openingText: movieData.opening_crawl,
//           releaseDate: movieData.release_date,
//         }));
//         setMovies(transformedMovies);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setIsLoading(false);
//       });
//   };


// async-await
function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const retryTimeoutRef = useRef(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
      setIsRetrying(false);
    } catch (err) {
      setError(err.message);
      setIsRetrying(true);
      retryTimeoutRef.current = setTimeout(fetchMoviesHandler, 5000);
    }

    setIsLoading(false);
  }, []);

  // Cancel retrying
  const stopRetryingHandler = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setIsRetrying(false);
    setError("Retrying stopped by user.");
  }, []);

  // Fetch movies automatically on mount
  useEffect(() => {
    fetchMoviesHandler();

    // Cleanup retry timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchMoviesHandler]);

  return (
    <div className="movies-container">
      <div className="fetch-section">
        {/* Optional manual fetch button */}
        <button className="fetch-btn" onClick={fetchMoviesHandler}>
          Fetch Movies
        </button>

        {isRetrying && (
          <button className="fetch-btn" onClick={stopRetryingHandler}>
            Cancel
          </button>
        )}
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