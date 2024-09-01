const express = require('express')
const router = express.Router()
const connection = require('../db')

// Home Route
router.get('/', (req, res) => {
	const page = parseInt(req.query.page) || 1 // Default to page 1 if not provided
	const limit = parseInt(req.query.limit) || 20 // Default to 10 movies per page if not provided
	const offset = (page - 1) * limit
	const genreId = req.query.genreId // Get the genreId from query parameters

	// Query to get all genres
	const getAllGenresQuery = `SELECT * FROM genre;`

	// Modify the movie query based on whether genreId is present
	let getMoviesQuery = `SELECT * FROM movie`
	let countQuery = `SELECT COUNT(*) AS total FROM movie`

	if (genreId) {
		getMoviesQuery += ` WHERE FIND_IN_SET(?, genre_ids)`
		countQuery += ` WHERE FIND_IN_SET(?, genre_ids)`
	}

	getMoviesQuery += ` LIMIT ? OFFSET ?;`

	// Query to get popular movies by joining with the popular table
	const getPopularMoviesQuery = `
					SELECT movie.*
					FROM movie
					JOIN popular ON movie.playerId = popular.popularId;
	`

	// Execute all queries in parallel
	connection.query(getAllGenresQuery, (err, genreResults) => {
		if (err) {
			console.error('Error fetching genres:', err.message)
			return res.status(500).json({ error: 'Failed to fetch genres' })
		}

		const movieParams = genreId ? [genreId, limit, offset] : [limit, offset]
		const countParams = genreId ? [genreId] : []

		connection.query(getMoviesQuery, movieParams, (err, movieResults) => {
			if (err) {
				console.error('Error fetching movies:', err.message)
				return res.status(500).json({ error: 'Failed to fetch movies' })
			}

			connection.query(countQuery, countParams, (err, countResult) => {
				if (err) {
					console.error('Error fetching movie count:', err.message)
					return res.status(500).json({ error: 'Failed to fetch movie count' })
				}

				const totalMovies = countResult[0].total
				const totalPages = Math.ceil(totalMovies / limit)

				connection.query(getPopularMoviesQuery, (err, popularResults) => {
					if (err) {
						console.error('Error fetching popular movies:', err.message)
						return res.status(500).json({ error: 'Failed to fetch popular movies' })
					}

					// Render the 'index' template and pass all necessary data
					res.render('index', {
						title: 'Каталог фильмов смотреть онлайн бесплатно в хорошем качестве',
						description: 'Смотрите лучшие фильмы онлайн бесплатно в нашем каталоге. Выберите кино на любой вкус и наслаждайтесь просмотром в хорошем качестве без регистрации.',
						keywords: 'смотреть фильмы онлайн, новинки кино, лучшие фильмы, бесплатные фильмы, фильмы в хорошем качестве, онлайн кинотеатр, популярные фильмы, последние фильмы, кино 2024, фильмы HD, жанры фильмов, боевики, комедии, драмы, фантастика',
						popular: popularResults,
						movies: movieResults,
						page,
						limit,
						totalMovies,
						totalPages,
						genres: genreResults, // Pass genres to the template
						selectedGenreId: genreId // Optionally pass the selected genre ID to the template
					})
				})
			})
		})
	})
})

module.exports = router
