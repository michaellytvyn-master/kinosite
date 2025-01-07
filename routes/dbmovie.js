const express = require("express");
const router = express.Router();
const connection = require("../db"); // Import the MySQL connection
const MovieClass = require("../model/movieSchema"); // Import the MovieClass

// Route to insert an example movie
router.get("/", async (req, res) => {
  // Function to insert an example movie
  function insertExampleMovie() {
    const movieData = {
      adult: false,
      backdrop_path: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
      genre_ids: [28, 35, 878],
      playerId: 533535,
      original_language: "en",
      original_title: "Deadpool & Wolverine",
      overview:
        "Уэйд Уилсон попадает в организацию «Управление временными изменениями», что вынуждает его вернуться к своему альтер-эго Дэдпулу и изменить историю с помощью Росомахи.",
      popularity: 3932.545,
      poster_path: "/u3io6TtRJUsVPMHDy8FKXd10blz.jpg",
      release_date: "2024-07-24",
      title: "Дэдпул и Росомаха",
      video: false,
      vote_average: 7.766,
      vote_count: 2495,
    };

    const movie = new MovieClass(movieData);

    const insertMovieQuery = `
									INSERT INTO movie (
													adult,
													backdrop_path,
													genre_ids,
													playerId,
													original_language,
													original_title,
													overview,
													popularity,
													poster_path,
													release_date,
													title,
													video,
													vote_average,
													vote_count,
													url
									) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
					`;

    // Extract properties from the object
    const {
      adult,
      backdropPath,
      genreIds,
      playerId,
      originalLanguage,
      originalTitle,
      overview,
      popularity,
      posterPath,
      releaseDate,
      title,
      video,
      voteAverage,
      voteCount,
      url,
    } = movie;

    // Execute the query
    connection.query(
      insertMovieQuery,
      [
        adult,
        backdropPath,
        JSON.stringify(genreIds), // Convert genre_ids array to JSON string
        playerId,
        originalLanguage,
        originalTitle,
        overview,
        popularity,
        posterPath,
        releaseDate,
        title,
        video,
        voteAverage,
        voteCount,
        url,
      ],
      (err, results) => {
        if (err) {
          console.error("Error inserting movie:", err.message);
          return res.status(500).json({ error: "Failed to insert movie" });
        }
        console.log(
          "Example movie inserted successfully with ID:",
          results.insertId,
        );
        return res
          .status(200)
          .json({
            message: "Movie inserted successfully",
            movieId: results.insertId,
          });
      },
    );
  }

  // Insert the example movie
  insertExampleMovie();
});

// Route to get a movie by its ID
router.get("/:id", (req, res) => {
  const movieId = req.params.id;

  const getMovieQuery = `
					SELECT * FROM movie WHERE id = ?;
	`;

  connection.query(getMovieQuery, [movieId], (err, results) => {
    if (err) {
      console.error("Error fetching movie:", err.message);
      return res.status(500).json({ error: "Failed to fetch movie" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(results[0]); // Return the movie details
  });
});

module.exports = router;
