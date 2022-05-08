const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



const serviceSchema = new mongoose.Schema({
 name: {
  type: String,
  required: [true, 'Name is required in this field!'],
 },
 ratingsAverage: {
  type: Number,
  default: 5,
 },
 ratingsQuantity: {
  type: Number,
  default: 0,
 },
 role: {
     type: String,
     enum: ['admin', 'patient', 'doctor'],
     default: 'patient',
 },
 price: {
  type: Number,
  required: [true, 'Price is required in this field!'],
 },
 summary: {
     type: String,
 },
});
//validator
serviceSchema.plugin(uniqueValidator);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
