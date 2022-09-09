const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

/////////////////////////////////////////////////////////////////////////////////
// SERVER SIDE RENDERING
/////////////////////////////////////////////////////////////////////////////////
// TEMPLATE ENGINE //
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/////////////////////////////////////////////////////////////////////////////////
// 1. GLOBAL MIDDLEWARES
/////////////////////////////////////////////////////////////////////////////////
// Serving Static Files //
app.use(express.static(path.join(__dirname, 'public')));

// SET SECURITY HTTP HEADERS //
app.use(helmet());

// HTTP REQUEST MIDDLEWARE LOGGER - DEVELOPMENT//
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// RATE LIMITING //
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.'
});
app.use('/api', limiter);

// BODY PARSER // Reading data from the body into req.body  //
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION //
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS ATTACK //
app.use(xss());

// PREVENT PARAMETER POPULATION //
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//app.use(compression());

// TEST MIDDLEWARE //
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////////////////////////////////////////////////////
// 4. Mounting the routes
/////////////////////////////////////////////////////////////////////////////////
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`${req.originalUrl} not found`);
  // err.status = 'error';
  // err.statusCode = 404;
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// ERROR HANDLING MIDDLEWARES //
app.use(globalErrorHandler);
/////////////////////////////////////////////////////////////////////////////////

module.exports = app;
