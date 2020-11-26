const mongoose = require('mongoose');

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(
        `Connected to the Database : ${connect.connection.host}`.bgGreen.black
    );
};

module.exports = connectDB;

// Normally, try-catch to handle connection errors, etc.
// However, in this case, the to make db.js neat, will create another handler in server.js instead
