const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const router = express.Router();
const connection = require("../db");

// Обертка для работы с асинхронным запросом к базе данных
const getMoviesFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const getMoviesQuery = `SELECT * FROM movie`;

    connection.query(getMoviesQuery, (err, movieResults) => {
      if (err) {
        console.error("Error fetching movies:", err.message);
        return reject(err);
      }
      resolve(movieResults);
    });
  });
};

router.get("/sitemap.xml", async (req, res) => {
  try {
    // Создаем поток Sitemap
    const sitemapStream = new SitemapStream({
      hostname: "https://kino-magnit.ru",
    });

    // Генерируем ссылки для Sitemap
    const links = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/politika-ispolzovaniya", changefreq: "weekly", priority: 0.8 },
      { url: "/privacy-policy", changefreq: "weekly", priority: 0.8 },
      // Добавляйте дополнительные ссылки на страницы вашего сайта
    ];

    // Добавляем каждую ссылку в поток
    links.forEach((link) => sitemapStream.write(link));

    // Пример добавления динамических страниц в sitemap
    const movies = await getMoviesFromDatabase(); // получаем фильмы из базы данных

    movies.forEach((movie) => {
      sitemapStream.write({
        url: `/movie/${movie.url}`,
        changefreq: "weekly",
        priority: 0.7,
      });
    });

    // Закрываем поток
    sitemapStream.end();

    // Преобразуем поток в XML и сжимаем его
    const sitemap = await streamToPromise(sitemapStream.pipe(createGzip()));

    // Отправляем карту сайта в формате XML
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");
    res.send(sitemap);
  } catch (error) {
    console.error("Ошибка генерации карты сайта:", error);
    res.status(500).end();
  }
});

module.exports = router;
