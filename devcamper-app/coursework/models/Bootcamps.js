const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

// Side note:
// models filename conventionally start with capital letter

// Set up schema
// Always consider if each element needs validations or not
const BootcampSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            maxlength: [50, 'Name must be less than 51 characters'],
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description must be less than 501 characters'],
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please use a valid URL',
            ],
        },
        phone: {
            type: String,
            maxlength: [20, 'Phone number must be shorter than 21 characters'],
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
        location: {
            // GeoJSON point
            type: {
                type: String,
                enum: ['Point'], // 'location.type' must be 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere', // Create a special 2dshpere index
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
        },
        careers: {
            type: [String], // Array of strings
            required: true,
            enum: [
                'Web Development',
                'Mobile Development',
                'UI/UX',
                'Data Science',
                'Business',
                'Other',
            ],
        },
        averageRating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating is maxed at 10'],
        },
        averageCost: Number,
        photo: {
            type: String,
            default: 'no-photo.jpg',
        },
        housing: {
            type: Boolean,
            default: false,
        },
        jobAssistance: {
            type: Boolean,
            default: false,
        },
        jobGuarantee: {
            type: Boolean,
            default: false,
        },
        acceptGi: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Mongoose middleware : no arrow function!
// Create slug from the document (Bootcamp) name - document mw
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Dissecting address into location field : node-geocoder & MapQuest API
BootcampSchema.pre('save', async function (next) {
    // Using callback
    const loc = await geocoder.geocode(this.address);
    // console.log(loc);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longtitude, loc[0].latitude], // following [longitude, latitude] format
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    };

    // Do not save address in DB
    this.address = undefined;
    next();
});

// Cascade delete courses when(before) a bootcamp is deleted
// Should amend the code for @delete controller afterwards
BootcampSchema.pre('remove', async function (next) {
    console.log(`Courese being removed from bootcamp ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});

// Reverse populate courses(another collection) with virtuals
BootcampSchema.virtual('courses', {
    // options that support popluating virtuals
    // populate when localField matches foreignField of ref model
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false,
});

// Exporting the model (model in lowercase!)
module.exports = mongoose.model('Bootcamp', BootcampSchema);
