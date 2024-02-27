const multer = require("multer")
const sharp = require("sharp")

const AppError = require("../utils/appError")
const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const factory = require("./handlerFactory")

// FILE STORAGE DISK- IMAGE HERE //
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// FILE STORAGE BUFFER- IMAGE HERE //
const multerStorage = multer.memoryStorage()

// FILE FILTER - CHECK FOR IMAGE TYPE//
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new AppError("Not an image! please upload only images.", 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.uploadUserPhoto = upload.single("photo")

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)

  next()
})

// FILTER BODY
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

// ROUTE HANDLES
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)

// CREATE USER //
/* NOT REQUIRED AS WE HAVE SIGNUP FUNCTION */
// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not defined'
//   });
// };
exports.createUser = factory.createOne(User)

// GET ME //
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

// UPDATE ME //
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword",
        400,
      ),
    )
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email")
  if (req.file) filteredBody.photo = req.file.filename

  // 3) Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    validators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
})

// DELETE ME //
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: "success",
    data: null,
  })
})
