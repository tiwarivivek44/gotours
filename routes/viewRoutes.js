const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
// const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

/////////////////////////////////////////////////////////////////////////////////
// ROUTES
/////////////////////////////////////////////////////////////////////////////////
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', viewController.getSignUpForm);
router.get('/forgot-password', viewController.getForgotPasswordForm);
router.get('/reset-password', viewController.getResetPasswordForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-bookings', authController.protect, viewController.getMyTours);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get(
  '/my-billings',
  authController.protect,
  viewController.getMyBillings
);

router.get('/aboutus', viewController.getAboutUs);
router.get('/downloadApp', viewController.getDowloadApp);
router.get('/becomeGuide', viewController.getBecomeGuide);
router.get('/careers', viewController.getCareers);
router.get('/contact', viewController.getContact);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

/////////////////////////////////////////////////////////////////
// MIDDLEWARE //
/////////////////////////////////////////////////////////////////
module.exports = router;
