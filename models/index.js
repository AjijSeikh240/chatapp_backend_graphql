"use strict";

import fs from "fs";
import path, { dirname } from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "node:url";
import * as dbConfig from "../config/db.config.js";
// const env = process.env.NODE_ENV || "development";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);

// import config from '../config/config.json'with { type: 'json' }; // Import the JSON config file

const db = {};

const sequelize = new Sequelize(
  dbConfig.default.DB,
  dbConfig.default.USER,
  dbConfig.default.PASSWORD,
  {
    host: dbConfig.default.HOST,
    dialect: dbConfig.default.dialect,
    operatorsAliases: 0,
    port: dbConfig.default.PORT,
    pool: {
      max: dbConfig.default.pool.max,
      min: dbConfig.default.pool.min,
      acquire: dbConfig.default.pool.acquire,
      idle: dbConfig.default.pool.idle,
    },
    define: {
      charset: "utf8",
      collate: "utf8_unicode_ci",
      timestamps: true,
    },
  }
);
sequelize
  .authenticate()
  .then(() => console.log("database is connected"))
  .catch((error) => console.log(error));

const fileData = async function () {
  const files = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  for await (const file of files) {
    const modelNames = await import(path.join("file://", __dirname, file));
    const model = await modelNames.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  //

  // sequelize
  //   .sync({ alter: true })
  //   .then(() => console.log(`table created`))
  //   .catch((error) => console.log(error));

  //
  return db;
};
const dbs = await fileData();
export default dbs;
