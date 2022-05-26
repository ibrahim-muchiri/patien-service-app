const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limiter');
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const patientRouter = require('./routes/patientRoute');
const serviceRouter = require('./routes/serviceRoute');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');
const bookingRouter = require('./routes/bookingRoute');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//Global Middleware
//Set security http headers
app.use(helmet());

//
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Limit request from the same IP
const Limiter = rateLimit({
max: 3,
windowMS: 60*60*1000,
message: 'Too many request from this IP, please try again after 1 hour'
});
app.use('/api', Limiter);

//body parser, reading data from body to req.body
app.use(express.json({limit: '10kb'}));

//serving static files
app.use(express.static(`${__dirname}/public`));

//Data sanitization against NoSQL query injection
app.use(mongosanitize());

//Data sanitization against xss
app.use(xss());

//For access from different domain
app.use(cors());

app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/bookings', bookingRouter); 

app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
   });
   
   app.use(globalErrorHandler);

module.exports = app;