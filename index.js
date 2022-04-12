const express = require('express');
const patientRouter = require('./routes/patientRoute');
const serviceRouter = require('./routes/serviceRoute');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');
const bookingRouter = require('./routes/bookingRoute');

const globalErrorHandler = require('./controllers/errorController');


const app = express();

app.use(express.json());

app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/bookings', bookingRouter); 

app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
   });
   
   app.use(globalErrorHandler);

module.exports = app;