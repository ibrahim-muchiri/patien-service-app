const express = require('express');
const patientController = require('../controllers/patientController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.restrictTo('admin'), authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, patientController.updateMe);

router.get('/me', authController.protect, patientController.getMe, patientController.getPatient);

router.delete('/deleteMe', authController.protect, patientController.deleteMe);

//authController.protect, 
router.route('/').get(authController.protect, patientController.getAllPatient)
.post(authController.protect, patientController.createPatient);

router.route('/:id').get(authController.protect, patientController.getPatient)
.patch(authController.protect, patientController.updatePatient)
.delete(authController.protect, patientController.deletePatient);

module.exports = router;
