// Load express module
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
const members = require('./Members');

const app = new express();

// Initialize Middleware (example)
// app.use(logger);

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware -> for create member post request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Homepage Route - preceeding static folder
app.get('/', (req, res) => res.render('index', {
    title: 'Member App',
    members
}));

// Set static folder/server
// But usually not what express is for -> json apis, template w/dynamic data
app.use(express.static(path.join(__dirname, 'public')));

// Members api routes
app.use('/api/members', require('./routes/api/members'));

// When deploying, look at env variables first or 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));










//////////////////////////////////////////////////////////////////////// 
// REFERENCE 
//////////////////////////////////////////////////////////////////////

// Create a route : sendFile, send
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })

// app.get('/', (req, res) => {
//     res.send('<h1>Hello Express!</h1>');
// })
