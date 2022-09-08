const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

/////////////////////////////////////////////////////////////////////////////////
// ROUTES and MIDDLEWAREs
/////////////////////////////////////////////////////////////////////////////////
const router = express.Router();

// MIDDLEWARE // Applicable to all routes below
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// MIDDLEWARE // All the routes after this only accessible to admin and Lead guide
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
