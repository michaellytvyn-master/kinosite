const express = require("express");
const path = require("path");
const app = express();

// Импорт маршрутов
const moviesRoutes = require("./routes/movies");
const movieRoutes = require("./routes/movie");
const genresRoutes = require("./routes/genre");
const homeRoutes = require("./routes/home");
const dbmovie = require("./routes/dbmovie");
const privecyRoutes = require("./routes/privecy");
const policyRoutes = require("./routes/policy");
const searchRoute = require("./routes/search");
const recRoute = require("./routes/recommended");
const sitemapRoute = require("./routes/sitemap"); // путь до вашего маршрута

const { engine } = require("express-handlebars");
const hbsHelpers = {
  range: function (start, end, options) {
    let result = "";
    for (let i = start; i <= end; i++) {
      result += options.fn(i); // options.fn is used here to generate the output for each iteration
    }
    return result;
  },
  ifEquals: function (arg1, arg2, options) {
    if (arg1 == arg2) {
      return options.fn(this); // returns the block if the condition is true
    }
    return options.inverse(this); // returns the else block if the condition is false
  },
  gt: function (v1, v2, options) {
    return v1 > v2 ? options.fn(this) : options.inverse(this); // Providing block logic for greater-than
  },
  lt: function (v1, v2, options) {
    return v1 < v2 ? options.fn(this) : options.inverse(this); // Providing block logic for less-than
  },
  add: function (v1, v2) {
    return v1 + v2; // Inline helper, no block required
  },
  subtract: function (v1, v2) {
    return v1 - v2; // Inline helper, no block required
  },
  max: function (v1, v2) {
    return v1 > v2 ? v1 : v2;
  },
  min: function (v1, v2) {
    return v1 < v2 ? v1 : v2;
  },
};

// Register these helpers in your Handlebars setup
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: hbsHelpers, // Register your custom helpers here
  }),
);
app.set("view engine", "hbs");

// Set up static folder for CSS
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
// Использование маршрутов
app.use("/api/dbmovie", dbmovie);
app.use("/api/movies", moviesRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/search", searchRoute);
app.use("/movie", movieRoutes);
app.use("/recommended", recRoute);
app.use("/politika-ispolzovaniya", privecyRoutes);
app.use("/privacy-policy", policyRoutes);
app.use("/", homeRoutes);
app.use(sitemapRoute);
// 404 Route (This should be at the end)
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
