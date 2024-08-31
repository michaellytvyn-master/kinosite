const mysql = require('mysql2')

// Create a connection to the database
const connection = mysql.createConnection({
	host: 'sql7.freemysqlhosting.net', // Replace with your MySQL host
	user: 'sql7728729',      // Replace with your MySQL username
	password: 'P7spyfVJy3', // Replace with your MySQL password
	database: 'sql7728729' // Replace with your MySQL database name
})

// const dropTableQuery = 'DROP TABLE IF EXISTS movie'

// connection.query(dropTableQuery, (err, results) => {
// 	if (err) {
// 		console.error('Error dropping table:', err.message)
// 	} else {
// 		console.log('Table dropped successfully')
// 	}
// })

function createMovieTable() {
	const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movie (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adult BOOLEAN NOT NULL,
        backdrop_path VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        genre_ids TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        playerId INT NOT NULL,
        original_language VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        original_title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        overview TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        popularity DECIMAL(10, 3),
        poster_path VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        release_date DATE,
        title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        video BOOLEAN NOT NULL,
        vote_average DECIMAL(3, 1),
        vote_count INT,
        url VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
    );
`



	connection.query(createTableQuery, (err, results) => {
		if (err) {
			console.error('Error creating movie table:', err.message)
		} else {
			console.log('Movie table created successfully')
		}
	})
}

// Connect to the database
connection.connect((err) => {
	if (err) {
		console.error('Error connecting to the database:', err.stack)
		return
	}
	console.log('Connected to the database as id ' + connection.threadId)

	createMovieTable()
})

// Export the connection for use in other modules
module.exports = connection
