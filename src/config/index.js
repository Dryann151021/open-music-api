require('dotenv').config();
const { Pool } = require('pg');

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },

  jwt: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },

  rabbitmq: {
    server: process.env.RABBITMQ_SERVICE,
  },

  redis: {
    server: process.env.REDIS_SERVER,
  },
};

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST || 'localhost',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432,
});

module.exports = { config, pool };
