const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

// ROUTES AND MIDDLEWARES
const router = express.Router()

router.post("/signup", authController.signup)
router.post("/login", authController.login)
router.get("/logout", authController.logout)
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)

// MIDDLEWARE //
// PROTECT ALL ROUTES AFTER THIS //
router.use(authController.protect)

router.patch("/updatePassword", authController.updatePassword)
router.get("/me", userController.getMe, userController.getUser)
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
)
router.patch("/deleteMe", userController.deleteMe)

// MIDDLEWARE //
// RESTRICT ALL THE ROUTES TO ADMIN AFTER THIS //
router.use(authController.restrictTo("admin"))

// GENERIC ROUTE
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser,
  )
  .delete(userController.deleteUser)

module.exports = router
