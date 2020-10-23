const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Read a local json file sync
const pathTourSimple = path.join(
    __dirname,
    'dev-data',
    'data',
    'tours-simple.json'
);

const tours = JSON.parse(fs.readFileSync(pathTourSimple));

// express.json() is a middleware
// that stays between request and response
// that can modify incoming request data
app.use(express.json());

// GET request
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            // ES6 not need specifying
            // both key : value if same name
            tours,
        },
    });
});

// GET Request - URL parameters i.e. individual data
// /:x /:y?(optional)
app.get('/api/v1/tours/:id', (req, res) => {
    // console.log(req.params);

    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    // if (id < tours.length) {}
    if (tour) {
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } else {
        res.status(404).json({ message: `No page found with id ${id}` });
    }
});

// POST request
app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(pathTourSimple, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
