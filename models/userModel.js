const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

///////////////////////////////////////////////////////////////////////////////////
// CREATE SCHEMA
///////////////////////////////////////////////////////////////////////////////////
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    maxlength: [40, 'A user name must have maximum 30 characters'],
    mimlength: [10, 'A tour name must have minimum 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
    mimlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match.'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true
    //select: false
  }
});

///////////////////////////////////////////////////////////////////////////////////
// MONGOOSE MIDDLEWARE
///////////////////////////////////////////////////////////////////////////////////

// 1. DOCUMENT MIDDLEWARE //
//////////////////////////////////////////////////////////
// Runs before .save() and .create() but not .insertMany()
// Only run this function if password was actually modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

///////////////////////////////////////////////////////////////////////////////////
// INSTANCE METHODS
///////////////////////////////////////////////////////////////////////////////////
userSchema.pre('save', function(next) {
  if (!this.isModified('password' || this.isNew)) return next();

  this.passwordChangedAtt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // This points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

///////////////////////////////////////////////////////////////////////
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

///////////////////////////////////////////////////////////////////////
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};
///////////////////////////////////////////////////////////////////////////////////
// CREATE MODEL
///////////////////////////////////////////////////////////////////////////////////
const User = mongoose.model('User', userSchema);

module.exports = User;
