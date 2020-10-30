const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app'); // run after configuring env

dotenv.config({ path: './config.env' }); // pathing env-variables
// console.log(process.env);

// CONNECTING TO ATLAS
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        // console.log(con.connections);
        console.log('DB connection successful!');
    })
    .catch((err) => console.error(err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
