const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title of the review'],
        maxlength: [50, 'Title should have less than 51 characters.'],
        trim: true,
    },
    text: {
        type: String,
        required: [true, 'Please add a text content of the review'],
        trim: true,
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating bewteen 1 and 10 inclusive'],
        min: 1,
        max: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Restricting user from posting more than one review per a bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const agg = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' },
            },
        },
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: agg[0].averageRating,
        });
    } catch (error) {
        console.error(error);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', function (next) {
    this.constructor.getAverageRating(this.bootcamp);
});

// Recalculate average rating when a bootcamp is deleted
ReviewSchema.pre('remove', function (next) {
    this.constructor.getAverageRatfing(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
