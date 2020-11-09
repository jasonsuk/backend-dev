const mongoose = require('mongoose');
const { default: validator } = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [
      true,
      'Please specify the name. Length must be within 5 - 40 letters.',
    ],
    unique: true,
    minlength: 5,
    maxlength: 40,
  },
  duration: {
    type: Number,
    required: [true, 'Please specify the duration.'],
  },
  maxGroupSize: {
    type: Number,
  },
  difficulty: {
    type: String,
    required: [
      true,
      'Please specify the difficulty: easy, medium or difficulty',
    ],
    enum: {
      values: ['easy', 'medium', 'difficult', 'test'],
      message:
        'Difficulty can be either: easy, medium or difficult. test for testing purpose only',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be between 1 - 5, inclusive'],
    max: [5, 'Rating must be between 1 - 5, inclusive'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Please specify the price.'],
  },
  priceDiscounted: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discounted price must be lower than the original price',
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Please specify the summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Please include an image cover for the tour'],
  },
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
