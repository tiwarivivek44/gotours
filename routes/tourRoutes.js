const express = require("express")
const tourController = require("../controllers/tourController")
const authController = require("../controllers/authController")
const reviewRouter = require("./reviewRoutes")

// ROUTES
const router = express.Router()

// NESTED ROUTES //
// POST /tour/234fdjhd/reviews
// GET /tour/234fdjhd/reviews
router.use("/:tourId/reviews", reviewRouter)

// Alias Route //
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours)

router.route("/tour-stats").get(tourController.getTourStats)

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan,
  )

// GEOSPATIAL ROUTES //
router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin)

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances)

// GENERIC ROUTES //
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour,
  )

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  )

module.exports = router
