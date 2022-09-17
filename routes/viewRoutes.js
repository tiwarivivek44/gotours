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
router.get('/signup', authController.isLoggedIn, viewController.getSignUpForm);
router.get(
  '/forgot-password',
  authController.isLoggedIn,
  viewController.getForgotPasswordForm
);
router.get(
  '/reset-password',
  authController.isLoggedIn,
  viewController.getResetPasswordForm
);

/////////////////////////////////////////////////////////////////////////////////
// Footer Routes
/////////////////////////////////////////////////////////////////////////////////
router.get('/aboutUs', authController.isLoggedIn, viewController.getAboutUs);
router.get('/careers', authController.isLoggedIn, viewController.getCareers);
router.get('/contact', authController.isLoggedIn, viewController.getContact);
router.get(
  '/downloadApp',
  authController.isLoggedIn,
  viewController.getDowloadApp
);
router.get(
  '/becomeGuide',
  authController.isLoggedIn,
  viewController.getBecomeGuide
);

/////////////////////////////////////////////////////////////////////////////////
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-bookings', authController.protect, viewController.getMyTours);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get(
  '/my-billings',
  authController.protect,
  viewController.getMyBillings
);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

/////////////////////////////////////////////////////////////////////////////////
// Admin Routes
/////////////////////////////////////////////////////////////////////////////////
router.get(
  '/manage-users',
  authController.protect,
  viewController.getManageUsers
);

router.get(
  '/manage-tours',
  authController.protect,
  viewController.getManageTours
);

router.get(
  '/user-details/:id',
  authController.protect,
  viewController.getUserDetails
);

router.get(
  '/tour-details/:id',
  authController.protect,
  viewController.getTourDetails
);

router.get('/create-user', authController.protect, viewController.createUser);

router.get('/create-tour', authController.protect, viewController.createTour);

/////////////////////////////////////////////////////////////////
module.exports = router;
