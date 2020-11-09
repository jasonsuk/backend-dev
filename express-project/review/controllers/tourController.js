const Tour = require('../models/tourModel');

async function getAllTours(req, res) {
  try {
    const allTours = Tour.find();

    res.status(200).json({
      status: 'success',
      data: {
        allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
}
async function getTour(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
}

async function addTour(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

async function updateTour(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

async function deleteTour(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

module.exports = {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
};
