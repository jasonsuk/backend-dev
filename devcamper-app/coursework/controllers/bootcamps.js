// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Get all bootcamps 🔥',
    });
};

// @desc        Get a single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Get a single bootcamp : ID ${req.params.id}`,
    });
};

// @desc        Create a new bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create a new bootcamp',
    });
};

// @desc        Update a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Update a bootcamp',
    });
};

// @desc        Delete a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Delete a bootcamp',
    });
};
