const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
   service: {
       type: mongoose.Schema.ObjectId,
       ref: 'Service',
       required: [true, 'booking miust belong to the service']
   },
   patient: {
       type: mongoose.Schema.ObjectId,
       ref: 'Patient',
       required: [true, 'booking must belong to the patient']
   },
   price: {
       type: Number,
       required: [true, 'booking must have the price'],
   },
   createdAt: {
       type: Date,
       default: Date.now()
   },
   paid: {
       type: Boolean,
       default: true
   }

})

bookingSchema.pre(/^find/, function(next){
    this.populate('patient').populate({
        path: 'service',
        select: 'name'
    });
    next();
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;