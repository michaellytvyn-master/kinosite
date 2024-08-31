const express = require('express')
const path = require('path')
const app = express()

// Импорт маршрутов
const moviesRoutes = require('./routes/movies')
const movieRoutes = require('./routes/movie')
const genresRoutes = require('./routes/genre')
const homeRoutes = require('./routes/home')
const dbmovie = require('./routes/dbmovie')
const searchRoute = require('./routes/search')

const { engine } = require('express-handlebars')
const hbsHelpers = {
	range: function (start, end, options) {
		let result = ''
		for (let i = start; i <= end; i++) {
			result += options.fn(i) // options.fn is used here to generate the output for each iteration
		}
		return result
	},
	ifEquals: function (arg1, arg2, options) {
		return (arg1 == arg2) ? options.fn(this) : options.inverse(this) // options.fn and options.inverse for block helpers
	},
	gt: function (v1, v2, options) {
		return v1 > v2 ? options.fn(this) : options.inverse(this) // Providing block logic for greater-than
	},
	lt: function (v1, v2, options) {
		return v1 < v2 ? options.fn(this) : options.inverse(this) // Providing block logic for less-than
	},
	add: function (v1, v2) {
		return v1 + v2 // Inline helper, no block required
	},
	subtract: function (v1, v2) {
		return v1 - v2 // Inline helper, no block required
	}
}

// Register these helpers in your Handlebars setup
app.engine(
	'hbs',
	engine({
		extname: 'hbs',
		defaultLayout: 'main',
		layoutsDir: path.join(__dirname, 'views/layouts'),
		partialsDir: path.join(__dirname, 'views/partials'),
		helpers: hbsHelpers
	})
)
app.set('view engine', 'hbs')

// Set up static folder for CSS
app.use(express.static(path.join(__dirname, 'public')))

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
// Использование маршрутов
app.use('/api/dbmovie', dbmovie)
app.use('/api/movies', moviesRoutes)
app.use('/api/genres', genresRoutes)
app.use('/api/search', searchRoute)
app.use('/movie', movieRoutes)
app.use('/', homeRoutes)

// 404 Route (This should be at the end)
app.use((req, res) => {
	res.status(404).render('404', { title: '404 - Page Not Found' })
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
