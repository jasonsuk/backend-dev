const mongoose = require('mongoose');

// SCHEMA
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: Number,
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            // select: false
        },
        startDates: [Date],
    },
    {
        // schema options
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// VIRTUAL PROPERTIES : manipulate the existing schema for business use
// : cannot be called with query : requires to state schema option

tourSchema.virtual('priceAfterTax').get(function () {
    return (this.price * 1.075).toFixed(2);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
