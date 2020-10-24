const express = require('express');
const app = express();

// Local Module from from utli.js
const {
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
} = require('./utils');

app.use(express.json());

app.route('/api/v1/tours').get(getAllTours).post(addTour);

app.route('/api/v1/tours/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`));
