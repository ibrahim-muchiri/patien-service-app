const express = require('express');
const serviceController = require('./../controllers/serviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(serviceController.getAllService).post(authController.protect, serviceController.createService);

router.route('/:id').get(serviceController.getService).patch(authController.protect, authController.restrictTo('admin'), serviceController.updateService).delete(authController.protect, authController.restrictTo(), serviceController.deleteService);

module.exports = router;