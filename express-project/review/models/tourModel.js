const mongoose = require('mongoose');
const slugify = require('slugify');
// const { default: validator } = require('validator');

const tourSchema = new mongoose.Schema(
    {
        isSecretTour: {
            type: Boolean,
            default: false,
        },
        slug: String,
        name: {
            type: String,
            required: [
                true,
                'Please specify the name. Length must be within 5 - 40 letters.',
            ],
            trim: true,
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
                message:
                    'Discounted price must be lower than the original price',
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// VIRTUAL PROPERTIES
tourSchema.virtual('priceAfterTax').get(function () {
    return Number((this.price * 1.075).toFixed(2));
});

// MIDDLEWARES
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.find({
        isSecretTour: { $ne: true },
        name: { $not: /.*(test|Test|TEST).*/ },
    });
    next();
});

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: {
            isSecretTour: { $ne: true },
            name: { $not: /.*(test|Test|TEST).*/ },
        },
    });

    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
