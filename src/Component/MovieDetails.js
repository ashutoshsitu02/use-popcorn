import { useEffect, useState } from "react";
import StarRating from "../StarRating";
import { KEY } from "../App";
import Loading from "./Loading";
import ErrorMessage from "./Error";

const MovieDetails = ({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movies) => movies.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const handleAdd = () => {
    const movieToAdd = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatchedMovie(movieToAdd);
    onCloseMovie();
  };

  useEffect(() => {
    const callBack = (e) => {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    };
    document.addEventListener("keydown", callBack);

    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [onCloseMovie]);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error(data.Error || "Something went wrong");
        }
        setMovie(data);
      } catch (error) {
        setError(error.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    document.title = loading ? "Loading..." : `Movie | ${movie.Title}`;

    return () => {
      document.title = "Use Popcorn";
    };
  }, [movie, loading]);

  return (
    <div className="details">
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>

            <img src={movie.Poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  <strong>You Rated This Movie {watchedUserRating} ⭐</strong>
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
