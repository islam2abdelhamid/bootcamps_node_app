const express = require('express');
const dotenv = require('dotenv');
require('colors');
const bootcamps = require('./routes/bootcamps');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`.yellow
      .bold
  )
);

server.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`).red;
  server.close(() => process.exit(1));
});
