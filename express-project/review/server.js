const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected!'))
  .catch((err) => console.log(err.message));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server loaded on PORT: ${PORT}`));
