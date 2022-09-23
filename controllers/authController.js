const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

/////////////////////////////////////////////////////////////////////////////////
// SIGN TOKEN
/////////////////////////////////////////////////////////////////////////////////
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/////////////////////////////////////////////////////////////////////////////////
// SEND SIGNED TOKEN
/////////////////////////////////////////////////////////////////////////////////
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.header('x-forwarded-proto') === 'https'
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/////////////////////////////////////////////////////////////////////////////////
// USER SIGNUP
/////////////////////////////////////////////////////////////////////////////////
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user)
    return next(new AppError('User with this email already exists', 400));

  const newUser = await User.create(req.body);

  // Send welcome email //
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser._id, 201, req, res);
});

/////////////////////////////////////////////////////////////////////////////////
// USER LOGIN
/////////////////////////////////////////////////////////////////////////////////
exports.login = catchAsync(async (req, res, next) => {
  //const email = req.body.email
  //const password = req.body.password
  const { email, password } = req.body;

  // 1) Check if email and password exists
  ///////////////////////////////////////////////////////////////////////
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists and password is correct
  ///////////////////////////////////////////////////////////////////////
  //const user = User.findOne({ email: email });
  const user = await User.findOne({ email }).select('+password');

  // 'Password12345' = '$2a$12$G04TQZdS2n2.hbmL9M4ayeoo/9AD.Wjy81P.k7rzmqATl9OCd2wR'
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  ///////////////////////////////////////////////////////////////////////
  createSendToken(user._id, 200, req, res);
});

/////////////////////////////////////////////////////////////////////////////////
// USER LOGOUT
/////////////////////////////////////////////////////////////////////////////////
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};

/////////////////////////////////////////////////////////////////////////////////
// PROTECT ROUTES
/////////////////////////////////////////////////////////////////////////////////
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  // 2) Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/////////////////////////////////////////////////////////////////////////////////
// IS LOGGED IN - ONLY FOR RENDERED PAGES
/////////////////////////////////////////////////////////////////////////////////
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Token verification
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

/////////////////////////////////////////////////////////////////////////////////
// RESTRICT DELETE
/////////////////////////////////////////////////////////////////////////////////
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/////////////////////////////////////////////////////////////////////////////////
// PASSWORD RESET
/////////////////////////////////////////////////////////////////////////////////
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user found with this email address', 404));
  }
  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email address
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/reset-password?resetToken=${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired and user exists, set new password
  if (!user) {
    return next(new AppError('Token is not valid or expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changePasswordAt property for the user
  // middileware

  // 4) Log the user in and send JWT
  createSendToken(user._id, 200, req, res);
});

/////////////////////////////////////////////////////////////////////////////////
// PASSWORD UPDATE
/////////////////////////////////////////////////////////////////////////////////
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }
  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Login user in, send JWT
  createSendToken(user._id, 200, req, res);
});
