const express = require("express");
const path = require("path");
const hbs = require("hbs");
const morgan = require("morgan");
require("dotenv").config();

const apiRoutes = require("./src/routes/api.routes");
const notFound = require("./src/middlewares/notFound.middleware");
const errorHandler = require("./src/middlewares/error.middleware");

const sequelize = require("./src/config/db");
require("./src/models"); // importa asociaciones

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

hbs.registerPartials(path.join(__dirname, "src/views/partials"));

app.use(express.static(path.join(__dirname, "src/public")));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.render("home", { title: "Instituto Fullstack" });
});

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