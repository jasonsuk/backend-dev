const express = require('express')
const router = express.Router()

// Routes for Bootcamps (/api/v1/bootcamps)
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Get all bootcamps 🔥',
    })
})

router.get('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Get a single bootcamp : ID ${req.params.id}`,
    })
})

router.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Add a new bootcamp',
    })
})

router.put('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Update a new bootcamp',
    })
})

router.delete('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Delete a new bootcamp',
    })
})

module.exports = router
