class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  // A. Filtering
  filter() {
    // CREATE QUERY //
    // CREATING A SHALLOW COPY OF REQ OBJECT & DELETING SOME QUERY FIELDS//
    const queryObj = { ...this.queryString }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((el) => delete queryObj[el])

    //  ADVANCED FILTERING //
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    // { duration: { $gte: '5' }, difficulty: 'easy' }
    // { duration: { gte: '5' }, difficulty: 'easy' }
    // gte, gt, lte, lt

    this.query.find(JSON.parse(queryStr))

    return this
  }

  //  B. SORTING
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ")
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort("-createdAt")
    }
    return this
  }

  //  C. Limiting Fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select("-__v")
    }
    return this
  }

  //  D. Pagination
  paginate() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100

    const skip = (page - 1) * limit

    // page=2&limit=10, 1-10 - page 1, 11-20 - page 2
    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
