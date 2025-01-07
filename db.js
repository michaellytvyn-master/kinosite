require("dotenv").config()
const mysql = require("mysql2")

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST.split(":")[0], // Extract the host without the port
  port: process.env.DB_HOST.split(":")[1] || 3306, // Default to 3306 if no port provided
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHARSET,
})

// const dropTableQuery = 'DROP TABLE IF EXISTS movie'

// connection.query(dropTableQuery, (err, results) => {
// 	if (err) {
// 		console.error('Error dropping table:', err.message)
// 	} else {
// 		console.log('Table dropped successfully')
// 	}
// })

const deleteMovieQuery = "DELETE FROM movie WHERE url = 'maxxxine1023922'"

connection.query(deleteMovieQuery, (err, results) => {
  if (err) {
    console.error("Error deleting movie:", err.message)
  } else {
    console.log("Movie deleted successfully")
  }
})

function createTables() {
  const createMovieTableQuery = `
    CREATE TABLE IF NOT EXISTS movie (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adult BOOLEAN NOT NULL,
        backdrop_path VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        genre_ids TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        playerId INT NOT NULL UNIQUE,
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
        url VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
    );
`

  const createGenreTableQuery = `
        CREATE TABLE IF NOT EXISTS genre (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
												genreId VARCHAR(255) NOT NULL UNIQUE
        );
    `

  const createPopularTableQuery = `
				CREATE TABLE IF NOT EXISTS popular (
								id INT AUTO_INCREMENT PRIMARY KEY,
								name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
								popularId VARCHAR(255) NOT NULL UNIQUE
				);
`

  connection.query(createMovieTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating movie table:", err.message)
    } else {
      console.log("Movie table created successfully")
    }
  })

  connection.query(createGenreTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating movie table:", err.message)
    } else {
      console.log("Movie table created successfully")
    }
  })

  connection.query(createPopularTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating popular movie table:", err.message)
    } else {
      console.log("popular table created successfully")
    }
  })
}

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack)
    return
  }
  console.log("Connected to the database as id " + connection.threadId)

  createTables()
})

// Export the connection for use in other modules
module.exports = connection
