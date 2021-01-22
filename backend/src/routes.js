const express = require("express");

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");

const routes = express.Router();

routes.get("/", function (request, response, next) {
  try {
    if (process.env.NODE_ENV === "development") {
      return response.json({
        application: process.env.APP_NAME,
        developer: "Lisma Team"
      });
    } else {
      return response.redirect(process.env.URL_WEB);
    }
  } catch (error) {
    next(error);
  }
});

routes.use("/api", AuthRoutes);
routes.use("/api", UserRoutes);

module.exports = routes;