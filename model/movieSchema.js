class MovieClass {
	constructor({
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
		vote_count
	}) {
		this.adult = adult
		this.backdropPath = backdrop_path
		this.genreIds = genre_ids
		this.playerId = playerId
		this.originalLanguage = original_language
		this.originalTitle = original_title
		this.overview = overview
		this.popularity = popularity
		this.posterPath = poster_path
		this.releaseDate = release_date || "2024-07-24"
		this.title = title
		this.video = video
		this.voteAverage = vote_average
		this.voteCount = vote_count
		this.url = `${MovieClass.generateSlug(original_title)}${playerId}` // Generate URL slug from title
	}

	static generateSlug(title) {
		return title
			.toLowerCase() // Convert to lowercase
			.trim() // Remove any leading or trailing spaces
			.replace(/[^a-z0-9\s-]/g, '') // Remove any non-alphanumeric characters (except spaces and hyphens)
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
	}


	// Method to return the object as a plain JavaScript object
	toObject() {
		return {
			adult: this.adult,
			backdropPath: this.backdropPath,
			genreIds: this.genreIds,
			playerId: this.playerId,
			originalLanguage: this.originalLanguage,
			originalTitle: this.originalTitle,
			overview: this.overview,
			popularity: this.popularity,
			posterPath: this.posterPath,
			releaseDate: this.releaseDate,
			title: this.title,
			video: this.video,
			voteAverage: this.voteAverage,
			voteCount: this.voteCount,
			url: this.url
		}
	}

	// Method to return the object as a JSON string
	toJson() {
		return JSON.stringify(this.toObject())
	}
}

module.exports = MovieClass