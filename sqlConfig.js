require('dotenv').config();

const defaulConfig = require('./default_sql_config');

const sqlConfig = {
  user: process.env.DB_USER || defaulConfig.DB_USER,
  password: process.env.DB_PASSWORD ||  defaulConfig.DB_PASSWORD,
  server: process.env.DB_SERVER || defaulConfig.DB_SERVER,
  database: process.env.DB_DATABASE || defaulConfig.DB_DATABASE,
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  }
};

module.exports = sqlConfig;