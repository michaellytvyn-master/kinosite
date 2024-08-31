const express = require('express')
const router = express.Router()
const connection = require('../db') // Assuming you have a db.js file that exports the database connection

// Search Route
router.get('/', (req, res) => {
	const searchQuery = req.query.query // Get the search query from the request

	if (!searchQuery) {
		return res.status(400).json({ error: 'Search query is required' })
	}

	// Query to search by title or original_title
	const searchSql = `
					SELECT * FROM movie
					WHERE title LIKE ? OR original_title LIKE ?;
	`

	// Use wildcards to match partial strings
	const searchValue = `%${searchQuery}%`

	connection.query(searchSql, [searchValue, searchValue], (err, results) => {
		if (err) {
			console.error('Error fetching search results:', err.message)
			return res.status(500).json({ error: 'Failed to fetch search results' })
		}

		// Render a results page or return JSON with the results
		res.render('search', { title: 'Search Results', movies: results })
	})
})


module.exports = router
