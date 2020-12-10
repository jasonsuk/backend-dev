const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks'],
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tution cost'],
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false,
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill required'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId, // configuration for a path in the schema
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Get average tuition cost of courses
// Mongoose statics for a function to be called directly on Course model
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    console.log('Calculating the average cost...'.blue);

    const agg = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' },
            },
        },
    ]);

    // agg returns an array of objects in it
    // i.e. [ { _id: 5d713995b721c3bb38c1f5d0, averageCost: 9600 } ]

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(agg[0].averageCost / 10) * 10,
        });
    } catch (error) {
        console.error(error);
    }
};

// Call averageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// Update averageCost when bootcamp(so then related course) deleted
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
