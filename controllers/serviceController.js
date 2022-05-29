const AppError = require('../utils/appError');
const Service = require('./../model/serviceModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllService = catchAsync(async(req, res, next)=>{
   
    const service = await Service.find();

    res.status(200).json({
        status: 'success',
        data: {
            service
        }
    })   
    next();
});

exports.getService = catchAsync( async(req, res, next)=>{
    const service = await Service.findById(req.params.id);

  
  if(!service) {
        return next(new AppError('No service with that Id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            service
        }
    })
    next();
});

exports.createService = catchAsync( async(req, res, next)=>{
   
        const service = await Service.create(req.body);   

        res.status(201).json({
            status: 'created',
            data: {
                service
            }
        });    
    
    next();
});
exports.updateService = catchAsync( async(req, res, next)=>{
    const service = await Service.findByIdAndUpdate(req.params.id, req.body);

    if(!service) {
        return next(new AppError('No service with that Id', 404));
    }
        res.status(201).json({
            status: 'Updated',
            data: {
                service
            }
        });  
        // next();  
})
exports.deleteService = catchAsync( async(req, res, next)=>{
    const service = await Service.findByIdAndDelete(req.params.id);

    if(!service) {
        return next(new AppError('No service with that Id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
         service
        },
       });
    next();
})