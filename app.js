const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
require('colors');

const connectDB = require('./config/db');

// Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// File uploads
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

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

//  😱
