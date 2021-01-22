require("dotenv").config();
const path = require('path');

module.exports = {
  development: {
    client: process.env.DB_TYPE,
    connection: process.env.DB_CONNECTION,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds"),
    },
  },

  production: {
    client: process.env.DB_TYPE,
    connection: process.env.DB_CONNECTION,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
  },
};