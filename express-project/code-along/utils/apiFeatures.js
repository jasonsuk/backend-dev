// CLASS to contain api features

class APIfeatures {
    constructor(query, queryString) {
        this.query = query; // from database = Tour.find()
        this.queryString = queryString; // from Express = req.query
    }

    filter() {
        // 1a) Basic filtering @ ?price[lte]=500
        const queryObj = { ...this.queryString };
        const queriesToExclude = ['page', 'sort', 'limit', 'fields'];
        queriesToExclude.forEach((el) => delete queryObj[el]);

        // 1b) Advanced filtering - gte, gt, lte, lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(lt|lte|gt|gte)\b/g,
            (match) => `$${match}`
        );

        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        // 2) Sorting @ ?sort=price
        if (this.queryString.sort) {
            const sortReqMulti = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortReqMulti); //.sort(price -ratingsAverage)
        } else {
            // Default
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        // 3) Limiting fields @ ?fields=name,price,difficulty,duration
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
            // or select: false in schema to limit response
        }

        return this;
    }

    paginate() {
        // 4) Paigination ?page=2&limit=10

        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        // Tour.skip(10).limit(10) // Page1 = 1-10, Page2 = 11-20

        // FOR skip > num of data
        // const numData = await Tour.countDocuments();
        // if (skip >= numData) throw new Error('No data exists');

        return this;
    }
}

module.exports = APIfeatures;
