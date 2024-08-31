const express = require('express')
const axios = require('axios')
const router = express.Router()

// http://localhost:3000/api/get-genres?genre_ids=28,12,35
// Your TMDB API Key
const TMDB_API_KEY = 'de94532d35add78bb95c7004ef2a92a4'

// Base URL for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Function to fetch all genres from TMDB
async function getGenresMap() {
	try {
		const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
			params: {
				api_key: TMDB_API_KEY,
				language: 'ru-RU', // You can change this to your preferred language
			},
		})

		// Create a map of genre IDs to genre names
		const genresMap = {}
		response.data.genres.forEach((genre) => {
			genresMap[genre.id] = genre.name
		})

		return genresMap
	} catch (error) {
		console.error('Error fetching genres:', error.message)
		return {}
	}
}

// Route to get genre names from genre IDs
router.get('/get-genres', async (req, res) => {
	try {
		// Expect genre_ids to be sent as a query parameter
		const genreIds = req.query.genre_ids ? req.query.genre_ids.split(',').map(Number) : []

		if (!genreIds.length) {
			return res.status(400).json({ error: 'Please provide genre_ids as a query parameter.' })
		}

		// Get the genres map
		const genresMap = await getGenresMap()

		// Map genre IDs to genre names
		const genreNames = genreIds.map((id) => genresMap[id]).filter(Boolean)

		// Return the genre names
		res.json({ genre_ids: genreIds, genre_names: genreNames })
	} catch (error) {
		console.error('Error in /get-genres route:', error.message)
		res.status(500).json({ error: 'Internal server error.' })
	}
})

// Function to fetch genres from TMDb
async function getGenres() {
	try {
		const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
			params: {
				api_key: TMDB_API_KEY,
				language: 'ru-RU' // You can specify the language
			}
		})

		const genres = response.data.genres
		return genres

	} catch (error) {
		console.error('Error fetching genres from TMDb:', error.message)
		return []
	}
}

// Route to get genres
router.get('/all', async (req, res) => {
	try {
		const genres = await getGenres()
		if (genres.length === 0) {
			return res.status(500).json({ error: 'Failed to fetch genres' })
		}
		res.json(genres)
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while fetching genres' })
	}
})

module.exports = router
