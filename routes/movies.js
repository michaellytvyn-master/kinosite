const express = require('express')
const axios = require('axios')
const router = express.Router()
const MovieClass = require('../model/movieSchema')
const PopularClass = require('../model/popularSchema')
const connection = require('../db')
// Ваш API ключ от TMDB
const API_KEY = 'de94532d35add78bb95c7004ef2a92a4'

// Базовый URL TMDB API
const BASE_URL = 'https://api.themoviedb.org/3'

// Маршрут для получения последних популярных фильмов
router.get('/popular', async (req, res) => {
	try {
		const response = await axios.get(`${BASE_URL}/movie/popular`, {
			params: {
				api_key: API_KEY,
				language: 'ru-RU', // Устанавливаем язык ответа (например, русский)
				page: 1 // Номер страницы (пагинация)
			}
		})

		// Возвращаем данные популярных фильмов в формате JSON
		res.json(response.data.results)
	} catch (error) {
		console.error('Ошибка при получении популярных фильмов:', error.message)
		res.status(500).json({ error: 'Не удалось получить данные популярных фильмов.' })
	}
})

// Route to find movie or TV show by external ID
router.get('/find/:id', async (req, res) => {
	const externalId = req.params.id

	if (!externalId) {
		return res.status(400).json({ error: 'Please provide both external_id and external_source query parameters.' })
	}

	try {
		const response = await axios.get(`${BASE_URL}/movie/${externalId}?language=ru-RU`, {
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTk0NTMyZDM1YWRkNzhiYjk1YzcwMDRlZjJhOTJhNCIsIm5iZiI6MTcyNDcwODc4MS45Mjk2MTUsInN1YiI6IjY2Y2NiMzViOWMxZmZlODRmYWIzNTJlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.S3wwhMdJRCHK6lE37gXE16RlAEnB4vDSIYdKPoYwTLM'
			}
		})

		// Return the results in JSON format
		res.json(response.data)
	} catch (error) {
		console.error('Ошибка при получении данных:', error.message)
		// res.status(500).json({ error: 'Не удалось получить данные.' })
	}
})

/// Route to save popular movies
router.get('/save-popular', async (req, res) => {
	try {
		const response = await axios.get(`${BASE_URL}/movie/popular`, {
			params: {
				api_key: API_KEY,
				language: 'ru-RU',
				page: 1
			}
		})

		// Insert the popular movies
		await insertMovies(response.data.results)

		// Return the popular movies data as JSON
		res.json({ message: 'Popular movies inserted successfully' })
	} catch (error) {
		console.error('Ошибка при получении популярных фильмов:', error.message)
		res.status(500).json({ error: 'Не удалось получить данные популярных фильмов.' })
	}

	// Function to insert movies into the database
	async function insertMovies(movies) {
		for (const movie of movies) {
			const popularObj = new PopularClass(movie.id, movie.title)

			const insertPopularQuery = `
													INSERT INTO popular (
																	popularId,
																	name
													) VALUES (?, ?)
													ON DUPLICATE KEY UPDATE 
																	name = VALUES(name);
									`

			// Execute the query for popular movies
			await new Promise((resolve, reject) => {
				connection.query(insertPopularQuery, [
					popularObj.popularId,
					popularObj.name
				], (err, results) => {
					if (err) {
						console.error('Error inserting popular movie:', err.message)
						return reject(err)
					}
					console.log(`Popular movie "${popularObj.name}" inserted successfully with ID:`, results.insertId)
					resolve(results)
				})
			})

			// Prepare movie data for insertion
			movie.playerId = movie.id  // Assigning playerId from movie.id
			const movieObj = new MovieClass(movie)

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
													) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
													ON DUPLICATE KEY UPDATE 
																	title = VALUES(title),
																	overview = VALUES(overview),
																	poster_path = VALUES(poster_path),
																	backdrop_path = VALUES(backdrop_path),
																	release_date = VALUES(release_date),
																	vote_average = VALUES(vote_average),
																	vote_count = VALUES(vote_count),
																	popularity = VALUES(popularity),
																	original_language = VALUES(original_language),
																	url = VALUES(url);
									`

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
				url
			} = movieObj

			// Execute the query for movies
			await new Promise((resolve, reject) => {
				connection.query(insertMovieQuery, [
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
					url
				], (err, results) => {
					if (err) {
						console.error('Error inserting movie:', err.message)
						return reject(err)
					}
					console.log(`Movie "${title}" inserted successfully with ID:`, results.insertId)
					resolve(results)
				})
			})
		}
	}
})

// Route to get movies where playerId matches popularId DB
router.get('/popular-movies', (req, res) => {
	const query = `
					SELECT movie.*
					FROM movie
					JOIN popular ON movie.playerId = popular.popularId;
	`

	connection.query(query, (err, results) => {
		if (err) {
			console.error('Error fetching popular movies:', err.message)
			return res.status(500).json({ error: 'Failed to fetch popular movies' })
		}

		res.json(results)
	})
})


router.get('/get-and-save-last-movies', async (req, res) => {
	let page = 1

	try {
		for (let i = 0; i < 1000; i++) { // Loop for 10 iterations

			const response = await axios.get(`${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=ru-RU&page=${page}&sort_by=popularity.desc`, {
				headers: {
					accept: 'application/json',
					Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTk0NTMyZDM1YWRkNzhiYjk1YzcwMDRlZjJhOTJhNCIsIm5iZiI6MTcyNDcwODc4MS45Mjk2MTUsInN1YiI6IjY2Y2NiMzViOWMxZmZlODRmYWIzNTJlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.S3wwhMdJRCHK6lE37gXE16RlAEnB4vDSIYdKPoYwTLM'
				}
			})

			// Insert the movies
			await insertMovies(response.data.results)

			page += 1 // Increment the page number

		}

		// Return the movies data as JSON
		res.json({ message: 'Movies inserted successfully' })

	} catch (error) {
		console.error('Ошибка при получении фильмов:', error.message)
		res.status(500).json({ error: 'Не удалось получить данные фильмов.' })
	}


	// Function to insert movies into the database
	async function insertMovies(movies) {
		for (const movie of movies) {

			// Prepare movie data for insertion
			movie.playerId = movie.id  // Assigning playerId from movie.id
			const movieObj = new MovieClass(movie)

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
													) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
													ON DUPLICATE KEY UPDATE 
																	title = VALUES(title),
																	overview = VALUES(overview),
																	poster_path = VALUES(poster_path),
																	backdrop_path = VALUES(backdrop_path),
																	release_date = VALUES(release_date),
																	vote_average = VALUES(vote_average),
																	vote_count = VALUES(vote_count),
																	popularity = VALUES(popularity),
																	original_language = VALUES(original_language),
																	url = VALUES(url);
									`

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
				url
			} = movieObj

			// Execute the query for movies
			await new Promise((resolve, reject) => {
				connection.query(insertMovieQuery, [
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
					url
				], (err, results) => {
					if (err) {
						console.error('Error inserting movie:', err.message)
						return reject(err)
					}
					console.log(`Movie "${title}" inserted successfully with ID:`, results.insertId)
					resolve(results)
				})
			})
		}
	}
})

module.exports = router
