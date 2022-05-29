const Patient = require('./../model/PatientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filteredObj = (obj, ...allowedFields)=>{
    const newObj = {};
Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)) newObj[el] = obj[el];
})
return newObj;
}

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

    if(!patient) {
        return next(new AppError('No patient with that Id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
    next();
});

exports.createPatient = catchAsync(async(req, res, next)=>{

    const patient = await Patient.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            patient
        }
    });
   
    next();
});

exports.updatePatient = catchAsync(async(req, res, next)=>{
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body);
    
    if(!patient) {
        return next(new AppError('No patient with that Id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
    next();
})

exports.deletePatient = catchAsync( async(req, res, next)=>{
    try{
        const patient = await Patient.findByIdAndDelete(req.params.id);
 
    if(!patient) {
        return next(new AppError('No patient with that Id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Deleted successfully'
    });
    }catch(err){
        console.log(err);
    }
    
    next();
});

exports.getMe = (req, res, next)=> {
    req.params.id = req.patient.id;
    next();
}

exports.updateMe = catchAsync(async(req, res, next) => {
    //Send error if patient POSTs password data
    try{
        if(req.body. password || req.body.passwordConfirm){
            return next(new AppError('This route is not for the password update. Please go to password update route.', 400));
        }
    }catch(err){
        console.log(err);
    }
    

    //Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = filteredObj(req.body, 'name', 'email');

     //Update the patient document
    const updatedPatient = await Patient.findByIdAndUpdate(req.patient.id, filteredBody,
          {active: true, runValidators: true});
   
    res.status(200).json({
         status: "success",
        data : {
            patient: updatedPatient
        }
    });
    next();
});
exports.deleteMe =catchAsync(async(req, res, next)=>{
    await Patient.findByIdAndUUpdate(req.patient.id, {active: false});

    res.status(200).json({
        status: 'success',
        data: null

    });

});