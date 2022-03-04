const express = require('express');
const serviceController = require('./../controllers/serviceController');
const router = express.Router();
const authController = require('./../controllers/authController');

router.route('/').get(serviceController.getAllService).post(authController.protect, authController.restrictTo('admin'), serviceController.createService);

router.route('/:id').get(serviceController.getService).patch(authController.protect, authController.restrictTo('admin'), serviceController.updateService).delete(authController.protect, authController.restrictTo(), serviceController.deleteService);

module.exports = router;