const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// SCHEMA
const tourSchema = new mongoose.Schema(
    {
        specialTour: {
            type: Boolean,
            required: [true, 'A tour must specify its special status'],
            default: false,
        },
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            minlength: [5, 'A tour name must have at least 5 letters'],
            maxlength: [40, 'A tour name cannot exceed more than 40 letters'],
            validate: [
                validator.isAlphanumeric,
                'A tour must contain alphabet letter or numbers only',
            ],
        },
        slug: String,
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
            enum: {
                values: ['easy', 'medium', 'difficulty', 'none'],
                message:
                    'Difficulty is either: easy, medium or difficulty. "none" is for the testing only',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [0, 'Rating must range between 0 and 5, inclusive'],
            max: [5, 'Rating must range between 0 and 5, inclusive'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // 'this' points to the newly created document only - not applicable to document to update
                    return val < this.price;
                },
                message: `Discounted Price {VALUE} must be less than the original price.`,
            },
        },
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

// DOCUMENT MIDDLEWARE : runs before .save() and .create()
// @ include slug
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
    // and must specify it in schema
});

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

// QUERY MIDDLEWARE : runs before .find() .delete() .update() ...
// @ filter out confidential tours i.e. special VIP tours
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ specialTour: { $ne: true } });
    this.start = Date.now();
    next();
});
// tourSchema.post(/^find/, function (docs, next) {
//     const queryTime = Date.now() - this.start;
//     console.log(`Query took ${queryTime} millisecond.`);
//     next();
// });

// AGGREGATE MIDDLEWARE : runs before await Tour.aggregate([])
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { specialTour: { $ne: true } },
    });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
