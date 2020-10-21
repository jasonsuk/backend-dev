const express = require('express');

const app = express();

// GET REQUEST
app.get('/', (req, res) => {
    // res.status(200).send('<h1>Hello from the server side!</h1>');
    res.status(200).json({
        message: 'Hello again from server side!',
        app: 'Natours',
    });
});

// POST REQUEST
app.post('/', (req, res) => {
    res.send('This message will be posted to the endpoint');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
