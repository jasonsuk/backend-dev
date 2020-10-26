const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // pathing env-variables
// console.log(process.env);

const app = require('./app'); // run after configuring env

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
