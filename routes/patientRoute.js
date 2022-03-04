const express = require('express');
const patientController = require('../controllers/patientController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

//authController.protect, 
router.route('/').get(patientController.getAllPatient).post(patientController.createPatient);

router.route('/:id').get(patientController.getPatient).patch(authController.protect, patientController.updatePatient).delete(authController.protect, authController.restrictTo('admin'), patientController.deletePatient);

module.exports = router;


