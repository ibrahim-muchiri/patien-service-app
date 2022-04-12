const express = require('express');
const Patient = require('./../model/PatientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//const router = express.Router();

exports.getAllPatient = catchAsync(async(req, res, next)=>{
    const patient = await Patient.find();

    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
    next();
});

exports.getPatient = catchAsync(async(req, res, next)=>{
    const patient = await Patient.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
    next();
});

exports.createPatient = catchAsync(async (req, res, next)=>{
try{
    const patient = await Patient.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            patient
        }
    });
}catch (err){
    console.log(err);
}
   
    next();
});

exports.updatePatient = catchAsync(async(req, res, next)=>{
    const patient = await Patient.findByIdAndUpdate(req.body.params, req.body);

    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
    next();
})

exports.deletePatient = catchAsync( async(req, res, next)=>{
    const patient = await Patient.findByIdAndDelete(req.body.params);

    res.status(200).json({
        status: 'success',
        message: "Deleted successfully"
    });
    next();
});