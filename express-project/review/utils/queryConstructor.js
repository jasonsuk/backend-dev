class QueryConstructor {
    constructor(dataObj, reqQuery) {
        this.dataObj = dataObj;
        this.reqQuery = reqQuery;
    }

    // 1) FILTERING
    filter() {
        let queryObj = { ...this.reqQuery };

        const queryToExclude = ['sort', 'fields', 'page', 'limit'];
        queryToExclude.forEach((key) => delete queryObj[key]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(lt|lte|gt|gte)\b/g,
            (match) => `$${match}`
        );

        this.dataObj = this.dataObj.find(JSON.parse(queryStr));
        return this;
    }

    // 2) SORT
    sort() {
        if (this.reqQuery.sort) {
            const sortQuery = this.reqQuery.sort.split(',').join(' ');
            this.dataObj = this.dataObj.sort(sortQuery);
        } else {
            this.dataObj = this.dataObj.sort('-createdAt');
        }
        return this;
    }

    // 3) LIMIT FIELDS
    limitFields() {
        if (this.reqQuery.fields) {
            const selectQuery = this.reqQuery.fields.split(',').join(' ');
            this.dataObj = this.dataObj.select(selectQuery);
        } else {
            this.dataObj = this.dataObj.select('-__v');
        }
        return this;
    }

    // 4) PAIGINATION
    paginate() {
        const reqPage = this.reqQuery.page * 1 || 1;
        const reqLimit = this.reqQuery.limit * 1 || 100;
        const skip = (reqPage - 1) * reqLimit;

        this.dataObj = this.dataObj.skip(skip).limit(reqLimit);
        return this;
    }
}

module.exports = QueryConstructor;
