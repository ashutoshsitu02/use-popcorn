import WatchedMovie from "./WatchedMovie";

const WatchedMovieList = ({ watched, onRemoveWatchedMovies }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveWatchedMovies={onRemoveWatchedMovies}
        />
      ))}
    </ul>
  );
};

export default WatchedMovieList;
