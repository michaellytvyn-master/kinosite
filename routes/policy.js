const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.render('privecy', {
		title: 'Политика конфиденциальности',
		description: 'Политика конфиденциальности описывает, как ваш сайт собирает, использует и защищает личную информацию пользователей.',
		keywords: 'политика конфиденциальности, защита данных, личная информация, обработка данных, конфиденциальность',
	})
})

module.exports = router