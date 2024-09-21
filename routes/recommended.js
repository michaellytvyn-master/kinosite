const express = require('express')
const router = express.Router()
const connection = require('../db')

router.get('/random-movies-by-genres', (req, res) => {
	// Extract the 'genres' parameter from the query string (e.g., ?genres=80,28,53)
	const genreIds = req.query.genres ? req.query.genres.split(',').map(Number) : []

	// If no genres are provided, return an error response
	if (genreIds.length === 0) {
		return res.status(400).json({ error: 'Please provide at least one genre ID.' })
	}

	// Construct the SQL query to select 4 random movies based on genre IDs
	// The genre_ids column is expected to be a JSON or comma-separated string, so we use LIKE to match genres
	const getRandomMoviesQuery = `
		SELECT * FROM movie
		WHERE ${genreIds.map(() => `genre_ids LIKE ?`).join(' OR ')}
		ORDER BY RAND()
		LIMIT 4;
	`

	// Prepare the query parameters (e.g., '%80%', '%28%', '%53%')
	const genreParams = genreIds.map(genreId => `%${genreId}%`)

	// Execute the SQL query
	connection.query(getRandomMoviesQuery, genreParams, (err, results) => {
		if (err) {
			console.error('Error fetching random movies:', err.message)
			return res.status(500).json({ error: 'An error occurred while fetching random movies.' })
		}

		// If no movies are found, return an empty array
		if (!results || results.length === 0) {
			return res.status(404).json({ message: 'No movies found for the provided genres.' })
		}

		// Send the movies data as a JSON response
		res.json({
			movies: results.map(movie => ({
				title: movie.title,
				posterPath: movie.poster_path,
				voteAverage: movie.vote_average,
				voteCount: movie.vote_count,
				url: movie.url
			}))
		})
	})
})

module.exports = router