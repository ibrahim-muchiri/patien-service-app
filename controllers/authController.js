const {promisify} = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Patient = require('./../model/PatientModel');
const crypto = require('crypto');
const Email = require('./../utils/email');
const jwt = require('jsonwebtoken');

const signToken = id=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN
    });
};
//COOKIES
const createSendToken = (patient, statusCode, res)=>{
const token = signToken(patient._id);

// const cookieOptions = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN *24*60*60*1000),

//     httpOnly: true
// };
// if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;   

// res.cookies('jwt', token, cookieOptions);

// patient.password =   undefined;

res.status(statusCode).json({
    status: 'success',
    token,
    data: {
        patient
    }
});
};

exports.signUp = catchAsync(async (req, res, next)=>{
 
    const newPatient = await Patient.create(req.body);    
  
    // const url = `${req.protocol}://${req.get('host')}/me`;
    // console.log(url);
    // await new Email(newPatient, url).sendWelcome();

    createSendToken(newPatient, 201, res);
});

exports.login = catchAsync(async(req, res, next)=>{ 
   
        const {email, password} = req.body        

        //1.Check if the email and password exist
    if(!email || !password){
        return next (new AppError('please, provide email and password', 401));
    }
    //2.check if user exist & password is correct
    const patient = await Patient.findOne({ email }).select('+password');

    if (
     !patient ||
     !(await patient.correctPassword(password, patient.password))
    ) {
     return next(new AppError('Incorrect password or email!', 401));
    }
    createSendToken(patient, 201, res);

next();
   
});


exports.protect = catchAsync(async (req, res, next) => {
    //1) Get the token and check if its there
    let token;
    if (
     req.headers.authorization &&
     req.headers.authorization.startsWith('Bearer')
    ) {
     token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
   
    if (!token) {
     //   console.log(token);
     next(new AppError('Please, Log in first for you to get access', 401));
    }
   
    //2) Verification of the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    //3.) Check if the user still exist
    const freshPatient = await Patient.findById(decoded.id);
    if (!freshPatient) {
     return next(
      new AppError('The user belonging to this id nolonger exist', 401)
     );
     //console.log(freshUser);
    }
    //4.) Check if the user changed the password after the token was issued
    if (freshPatient.changedPasswordAfter(decoded.iat)) {
     return next(
      new AppError('Patient recently changed the password!, please log in again', 401)
     );
    }
   
    //GRANT ACCESS TO THE PROTECTED ROUTE
    req.patient = freshPatient;
    next();
   });

// exports.restrictTo =  (...roles) => {
// return (req, res, next) => {
//      if (!roles.includes(req.patient.role)) {
//       return next(
//        new AppError('You do not have a permission to perform this action', 403)
//       );
//      }
//      next();
//     };
//    };
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
     if (!roles.includes(req.patient.role)) {
      return next(
       new AppError('You do not have a permission to perform this action', 403)
      );
     }
     next();
    };   
   };
   
   
   exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1.) Get user based on POsted email
        const patient = await Patient.findOne({ email: req.body.email });
    if (!patient) {
     return next(new AppError('There is no patient with that email address!', 404));
    }
    //2.) Genetrate the random reset token
    const resetToken = patient.createPasswordResetToken();
     await patient.save({ validateBeforeSave: false });
   
    //3.) Send it to the user's email
    const resetURL = `${req.protocol}://${req.get(
     'host'
    )}/api/v1/patients/resetPassword/${resetToken}`;
   
    const message = `Forgot your password? Submit a PATCH request 
    with your new password and passwordConfirm to: ${resetURL}.\nif you didn't forget your password, please ignore this email `;

    
    try {
    //  await sendEmail({
    //   email: patient.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message
    //  });
   
     res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
     });
    } catch (err) {
     patient.passwordResetToken = undefined;
     patient.passwordResetExpires = undefined;     
     await patient.save({ validateBeforeSave: false });
   
     return next(
      new AppError(
       'There was an error sending the email, please try again later!', 500));
    }
   });
   

   exports.resetPassword =  catchAsync(async (req, res, next) => {
    //1.Get user based on the token
    const hashedPassword = crypto
     .createHash('sha256')
     .update(req.params.token)
     .digest('Hex');
   
    const patient = await Patient.findOne({
     passwordResetToken: hashedToken,
     passwordResetExpires: { $gt: Date.now() }
    });
   
    //2. If token has not expired, there is a new user, send a new password
    if (!patient) {
     return next(new AppError('token is invalid or has expired', 401));
    }
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const passwordResetToken = undefined;
    const passwordResetExpires = undefined;
    await patient.save();
   
    //3.
   
    //4. Log a patient in, send JWT
    // const token = signToken(patient._id);
    // res.status(200).json({
    //  status: 'success', 
    //  token,
    // });
    createSendToken(patient, 200, res);
   });
   
exports.updatePassword = catchAsync( async(req, res, next)=>{
    try{
           //Find user from the collection
const patient = await Patient.findById(req.patient.id);
//Check if Posted current password is corect
if(!(await user.correctPassword(req.body.passwordCurrent, patient.password)));
return next(new AppError('Your current password is wrong', 401));
//if so, update password
patient.password = req.body.password;
patient.passwordConfirm = req.body.passwordConfirm;
return patient.save();
//User.findByIdAndUpdate will not work as intended!
createSendToken(patient, 200, res);

    }catch(err){
        console.log(err);
    }
 

next();
});