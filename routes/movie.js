const express = require("express");
const router = express.Router();
// API URL and Key (assuming you have an API key)
const API_URL = "https://api.kinobox.tv/v1"; // Replace with the correct Kinobox.tv API URL
const connection = require("../db");

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/:slug", (req, res) => {
  const movieSlug = req.params.slug; // Extract the 'slug' parameter from the URL

  const getMovieQuery = `
					SELECT * FROM movie WHERE url = ?;
	`;

  // Execute the SQL query to get the movie details
  connection.query(getMovieQuery, [movieSlug], (err, results) => {
    if (err) {
      console.error("Error fetching movie:", err.message);
      return res
        .status(500)
        .render("error", {
          title: "Error",
          message: "An error occurred while fetching the movie.",
        });
    }

    // If no movie is found, render a 404 page
    if (!results || results.length === 0) {
      console.error("Movie not found");
      return res.status(404).render("404", { title: "404 - Page Not Found" });
    }

    // Destructure the movie data from the result
    const {
      playerId,
      genre_ids: genreIds,
      title: movieTitle,
      overview: movieOverview,
      poster_path: posterPath,
      backdrop_path: backdropPath,
      release_date: releaseDateRaw,
      vote_average: voteAverage,
      vote_count: voteCount,
      original_title,
    } = results[0];

    // Format the release date to 'YYYY-MM-DD'
    const releaseDate = new Date(releaseDateRaw).toISOString().split("T")[0];

    // Round the vote average to the nearest whole number for star rating
    const stars = Math.round(parseFloat(voteAverage));
    const noStars = 10 - stars;

    // Generate arrays for stars and empty stars
    const starsIcons = Array(stars).fill(0);
    const starsNoIcons = Array(noStars).fill(0);

    // Render the 'movie' template and pass the data to it
    res.render("movie", {
      title: `${movieTitle} - Смотреть онлайн`,
      description: movieOverview,
      keywords: `Смотреть ${movieTitle} онлайн, ${movieTitle} cмотреть онлайн, ${movieTitle} бесплатно, ${movieTitle} полный фильм, ${movieTitle} в хорошем качестве`,
      playerId,
      genreIds: `${genreIds}`,
      movieTitle,
      movieOverview,
      posterPath,
      backdropPath,
      releaseDate,
      voteAverage,
      voteCount,
      starsIcons,
      starsNoIcons,
      original_title,
    });
  });
});

// Search Route
router.post("/search", async (req, res) => {
  const query = req.body.query;
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        query: query,
        api_key: API_KEY,
      },
    });

    const movies = response.data.results; // Adjust based on API response structure
    res.render("index", { title: "Kinobox Player", movies });
  } catch (error) {
    console.error(error);
    res.render("index", {
      title: "Kinobox Player",
      error: "Error fetching data from API",
    });
  }
});

module.exports = router;
