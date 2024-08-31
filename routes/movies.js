const express = require('express')
const axios = require('axios')
const router = express.Router()

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

module.exports = router
