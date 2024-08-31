const express = require('express')
const path = require('path')
const app = express()

// Импорт маршрутов
const moviesRoutes = require('./routes/movies')
const movieRoutes = require('./routes/movie')
const genresRoutes = require('./routes/genre')
const homeRoutes = require('./routes/home')
const dbmovie = require('./routes/dbmovie')
const { engine } = require('express-handlebars')

app.engine(
	'hbs',
	engine({
		extname: 'hbs', // Set the file extension for Handlebars templates
		defaultLayout: 'main', // Set the default layout
		layoutsDir: path.join(__dirname, 'views/layouts'), // Specify the layouts directory
		partialsDir: path.join(__dirname, 'views/partials') // Optional: Specify the partials directory
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
