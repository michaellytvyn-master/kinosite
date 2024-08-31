const connection = require('../db')

class PopularClass {
	constructor(popularId, name) {
		this.popularId = popularId
		this.name = name
	}

	// Method to return the object as a plain JavaScript object
	toObject() {
		return {
			popularId: this.popularId,
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
								INSERT INTO popular (popularId, name)
								VALUES (?, ?)
								ON DUPLICATE KEY UPDATE name = VALUES(name);
				`

		connection.query(insertQuery, [this.popularId, this.name], (err, results) => {
			if (err) {
				console.error('Error saving popular to database:', err.message)
				callback(err)
			} else {
				console.log(`popular ${this.name} saved successfully.`)
				callback(null, results)
			}
		})
	}
}

module.exports = PopularClass