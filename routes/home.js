const express = require('express')
const router = express.Router()
const connection = require('../db')
// Home Route
router.get('/', (req, res) => {

	const page = parseInt(req.query.page) || 1 // Default to page 1 if not provided
	const limit = parseInt(req.query.limit) || 10 // Default to 10 movies per page if not provided
	const offset = (page - 1) * limit

	const countQuery = 'SELECT COUNT(*) AS total FROM movie;'

	// First query to get paginated movies
	const getMoviesQuery = `
					SELECT * FROM movie
					LIMIT ? OFFSET ?;
	`

	connection.query(getMoviesQuery, [limit, offset], (err, movieResults) => {
		if (err) {
			console.error('Error fetching movies:', err.message)
			return res.status(500).json({ error: 'Failed to fetch movies' })
		}

		// Second query to get the total count of movies
		const countQuery = 'SELECT COUNT(*) AS total FROM movie;'
		connection.query(countQuery, (err, countResult) => {
			if (err) {
				console.error('Error fetching movie count:', err.message)
				return res.status(500).json({ error: 'Failed to fetch movie count' })
			}

			const totalMovies = countResult[0].total
			const totalPages = Math.ceil(totalMovies / limit)

			// Third query to get popular movies by joining with the popular table
			const getPopularMoviesQuery = `
							SELECT movie.*
							FROM movie
							JOIN popular ON movie.playerId = popular.popularId;
			`

			connection.query(getPopularMoviesQuery, (err, popularResults) => {
				if (err) {
					console.error('Error fetching popular movies:', err.message)
					return res.status(500).json({ error: 'Failed to fetch popular movies' })
				}

				connection.query(countQuery, (err, results) => {
					if (err) {
						console.error('Error fetching movie count:', err.message)
						return res.status(500).json({ error: 'Failed to fetch movie count' })
					}

					const totalMovies = results[0].total
					// Render the 'index' template and pass all necessary data
					res.render('index', {
						title: 'Home',
						popular: popularResults,
						movies: movieResults,
						page,
						limit,
						totalMovies,
						totalPages,
						totalMovies
					})
				})

			})
		})
	})
})



module.exports = router