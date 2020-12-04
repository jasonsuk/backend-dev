const advancedQuery = (model, fieldToPopulate) => async (req, res, next) => {
    // Advanced query
    let query;

    // Remove fields that do not match database keys
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach((field) => delete reqQuery[field]);

    // @ /api/v1/bootcamps?location.state=MA&averageCost[lte]=10000
    // @ /api/v1/bootcamps?careers[in]=Data+Science

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
        /\b(lt|lte|gt|gte|in)\b/g,
        (match) => `$${match}`
    );

    query = model.find(JSON.parse(queryStr));

    // Select fields
    // @ /api/v1/bootcamps?select=name,location.state,averageCost
    if (req.query.select) {
        const selectFields = req.query.select.split(',').join(' ');
        query = query.select(selectFields);
    }

    // Sort fields
    // @ /api/v1/bootcamps?sort=-averageCost
    if (req.query.sort) {
        const sortFields = req.query.sort.split(',').join(' ');
        query = query.sort(sortFields);
    } else {
        // Default sort : most recently created one on top
        query = query.sort({ createdAt: -1 });
    }

    // Pagination
    // @ /api/v1/bootcamps?page=3&limit=5
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    // const skip = (page - 1) * limit; // by default 0

    const startIndex = (page - 1) * limit; // by default 0
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (fieldToPopulate) {
        query = query.populate(fieldToPopulate);
    }

    const results = await query;

    // Responding with information about prev / next page
    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    // Create object to save the final result
    res.advancedQueryResults = {
        success: true,
        count: results.length,
        requestTime: req.requestTime,
        pagination,
        data: results,
    };

    next();
};

module.exports = advancedQuery;
