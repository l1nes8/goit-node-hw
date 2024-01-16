const catchAsync = require("../utils/catchAsync.js");
const { checkUserExists, getOneUser } = require("../services/authServices");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../validate/validateSchem.js");
const HttpError = require("../utils/HttpErrors");
const { checkToken } = require("../services/jwtService");
const ImageServices = require("../services/imageServices.js");
const User = require("../models/userSchem.js");

exports.checkRegisterUser = catchAsync(async (req, res, next) => {
  const { value, error } = registerUserSchema.validate(req.body);

  if (error) throw new HttpError(400, error.details[0].message);

  await checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkLoginUser = catchAsync(async (req, res, next) => {
  const { value, error } = loginUserSchema.validate(req.body);

  if (error) throw new HttpError(400, error.details[0].message);

  req.body = value;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = checkToken(token);

  if (!userId) throw new HttpError(401, "Not logged in..");

  const currentUser = await getOneUser(userId);

  if (!currentUser) throw new HttpError(401, "Not logged in..");

  req.user = currentUser;

  next();
});

exports.checkToken = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = checkToken(token);

  if (!userId) throw new HttpError(401, "Not authorized");

  const currentUser = await getOneUser(userId);

  if (!currentUser) throw new HttpError(401, "Not authorized");

  next();
});

exports.checkUser = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = checkToken(token);

  if (!userId) throw new HttpError(401, "Not logged in..");

  const currentUser = await getOneUser(userId);

  if (!currentUser) throw new HttpError(401, "Not logged in..");

  req.user = {
    email: currentUser.email,
    subscription: currentUser.subscription,
    avatar: currentUser.avatarURL,
  };

  next();
});

exports.uploadAvatarFilter = ImageServices.initUploadImageMiddleware("avatar");

exports.getUserByEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

exports.verifyMiddleware = (req, res, next) => {
  const { user } = req;

  console.log("User:", user);

  if (!req.body.email) {
    throw new HttpError(400, "missing required field email");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  next();
};
