const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
require("dotenv").config();

const apiRoutes = require("./src/routes/api.routes");
const notFound = require("./src/middlewares/notFound.middleware");
const errorHandler = require("./src/middlewares/error.middleware");
const viewRoutes = require("./src/routes/view.routes");
const sequelize = require("./src/config/db");
require("./src/models");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Handlebars engine (layouts + partials)
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "src/views/layouts"),
    partialsDir: path.join(__dirname, "src/views/partials"),
    defaultLayout: "main", // usa layouts/main.hbs
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// ✅ estáticos
app.use(express.static(path.join(__dirname, "src/public")));

// ✅ rutas
app.use("/api", apiRoutes);
app.use("/", viewRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("📦 Tablas sincronizadas");
    }

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server en puerto ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
};

start();