const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
 name: {
  type: String,
 },
 ratingsAverage: {
  type: Number,
  default: 5,
 },
 ratingsQuantity: {
  type: Number,
  default: 0,
 },
 price: {
  type: Number,
  required: [true, 'Price is required in this field!'],
 },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
