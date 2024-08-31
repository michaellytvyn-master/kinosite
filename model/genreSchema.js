const connection = require('../db')

class GenreClass {
	constructor({
		genreId,
		name
	}) {
		this.genreId = genreId
		this.name = name
	}


	// Method to return the object as a plain JavaScript object
	toObject() {
		return {
			genreId: this.genreId,
			name: this.name,
		}
	}

	// Method to return the object as a JSON string
	toJson() {
		return JSON.stringify(this.toObject())
	}

	// Method to save the genre to the database
	saveToDatabase(callback) {
		const insertQuery = `
								INSERT INTO genre (genreId, name)
								VALUES (?, ?)
								ON DUPLICATE KEY UPDATE name = VALUES(name);
				`

		connection.query(insertQuery, [this.genreId, this.name], (err, results) => {
			if (err) {
				console.error('Error saving genre to database:', err.message)
				callback(err)
			} else {
				console.log(`Genre ${this.name} saved successfully.`)
				callback(null, results)
			}
		})
	}
}

module.exports = GenreClass