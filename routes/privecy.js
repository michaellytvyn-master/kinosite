const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.render('privecy', {
		title: 'Политика использования сайта - Защита авторских прав и ответственность',
		description: 'Ознакомьтесь с политикой использования нашего сайта. Узнайте, как мы защищаем авторские права, ответственность за контент и взаимодействие с третьими лицами, предоставляющими видеоконтент.',
		keywords: 'политика использования, авторские права, видеоконтент, удаление контента, ответственность за контент, третий лиц, плееры, онлайн фильмы',
	})
})

module.exports = router