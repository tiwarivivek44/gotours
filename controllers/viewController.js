const Tour = require("../models/tourModel")
const User = require("../models/userModel")
const Review = require("../models/reviewModel")
const Booking = require("../models/bookingModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.alerts = (req, res, next) => {
  const { alert } = req.query

  if (alert === "booking")
    res.locals.alert =
      "You booking was successful! Please check your email for confirmation. If your booking doesn't show up immediatly please come back later."
  next()
}
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find()

  if (!tours) return next(new AppError("No tour data found.", 404))

  // 2) Build template - PUG File
  // 3) Render the template using the tour data from step 1
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  })
  next()
})

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating, user",
  })
  if (!tour) {
    return next(new AppError("There is no tour with this name", 404))
  }
  // 2) Build template -- PUG File
  // 3) Render the template using the tour data from step 1
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  })
  next()
})

exports.getSignUpForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign Up",
  })
  next()
})

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  })
  next()
})

exports.getForgotPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render("forgotPassword", {
    title: "Forgot password",
  })
  next()
})

exports.getResetPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render("resetPassword", {
    title: "Reset your password",
  })
  next()
})

//////////////////////////////////////////////////////////////////
exports.getAboutUs = catchAsync(async (req, res, next) => {
  res.status(200).render("aboutUs", {
    title: "About us",
  })
  next()
})

exports.getDowloadApp = catchAsync(async (req, res, next) => {
  res.status(200).render("downloadApp", {
    title: "Dowload App",
  })
  next()
})

exports.getBecomeGuide = catchAsync(async (req, res, next) => {
  res.status(200).render("becomeGuide", {
    title: "Become a guide",
  })
  next()
})

exports.getCareers = catchAsync(async (req, res, next) => {
  res.status(200).render("careers", {
    title: "Careers",
  })
  next()
})

exports.getContact = catchAsync(async (req, res, next) => {
  res.status(200).render("contact", {
    title: "Contact",
  })
  next()
})

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render("account", {
    title: "Your account",
  })
  next()
})

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id })

  if (!bookings) return next()

  // 2) Find tours with the returned ids
  const tourIds = bookings.map((el) => el.tour)

  const tours = await Tour.find({ _id: { $in: tourIds } })

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  })
  next()
})

exports.getMyBillings = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id })

  if (!bookings) return next()

  res.status(200).render("billings", {
    title: "My Billings",
    bookings,
  })
  next()
})

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // 1) Find all reviews for the user
  const reviews = await Review.find({ user: req.user.id })

  if (!reviews) return next()

  res.status(200).render("reviews", {
    title: "My Reviews",
    reviews,
  })
  next()
})

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!updatedUser) return next()

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  })
  next()
})

// Admin
exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  if (!users) return next()

  res.status(200).render("manageUsers", {
    title: "Manage Users",
    users,
  })
  next()
})

exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()

  if (!tours) return next()
  res.status(200).render("manageTours", {
    title: "Manage Tours",
    tours,
  })
  next()
})

exports.getUserDetails = catchAsync(async (req, res, next) => {
  const userdata = await User.findById(req.params.id)

  if (!userdata) return next()

  res.status(200).render("userDetails", {
    title: "User Details",
    userdata,
  })
  next()
})

exports.getTourDetails = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) return next()

  res.status(200).render("tourDetails", {
    title: "Tour Details",
    tour,
  })
  next()
})

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(200).render("createUser", {
    title: "Create New User",
  })
  next()
})

exports.createTour = catchAsync(async (req, res, next) => {
  res.status(200).render("createTour", {
    title: "Create New Tour",
  })
  next()
})
