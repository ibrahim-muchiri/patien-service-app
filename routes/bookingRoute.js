const express = require('express');
const { model } = require('mongoose');
const bookingController = require('../controllers/patientController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/chechout-session/:serviceId', authController.protect, bookingController.getCheckoutSession);

model.exports = router;