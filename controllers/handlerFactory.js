const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const APIFeatures = require("../utils/apiFeatures")

// GET ALL DOCUMENTS //
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // TO ALLOW FOR NESTED GET REVIEWS ON TOUR MODEL (HACK)
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    // EXECUTE QUERY  //
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const document = await features.query
    //const document = await features.query.explain();

    // SEND RESPONSE  //
    res.status(200).json({
      status: "success",
      results: document.length,
      data: {
        data: document,
      },
    })
  })

// GET DOCUMENT //
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)

    // const document = await Model.findById(req.params.id).populate('reviews');
    const document = await query

    if (!document) {
      return next(new AppError("No document found with with this id", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    })
  })

// CREATE NEW DOCUMENT //
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        data: document,
      },
    })
  })

// UPDATE DOCUMENT //
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!document)
      return next(new AppError("No document found with with this id", 404))
    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    })
  })

// DELETE DOCUMENT //
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id)

    if (!document) {
      return next(new AppError("No document found with with this id", 404))
    }
    res.status(204).json({
      status: "success",
      data: null,
    })
  })
