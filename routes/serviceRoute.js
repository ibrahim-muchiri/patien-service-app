const express = require('express');
const serviceController = require('./../controllers/serviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, serviceController.getAllService)
.post(authController.protect, authController.restrictTo('admin'), serviceController.createService);

router.route('/:id').get(authController.protect, serviceController.getService)
.patch(authController.protect, authController.restrictTo('admin'), serviceController.updateService)
.delete(authController.protect, serviceController.deleteService);

//, authController.restrictTo('admin'), 

module.exports = router;