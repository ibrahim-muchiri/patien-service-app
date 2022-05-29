const express = require('express');
const serviceController = require('./../controllers/serviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, serviceController.getAllService)
.post(authController.protect, authController.restrictTo('Admin'), serviceController.createService);

router.route('/:id').get(authController.protect, serviceController.getService)
.patch(authController.protect, authController.restrictTo('Admin'), serviceController.updateService)
.delete(authController.protect, authController.restrictTo('Admin'), serviceController.deleteService);

module.exports = router;