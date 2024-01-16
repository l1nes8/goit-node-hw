const User = require("../models/userSchem");
const HttpError = require("../utils/HttpErrors");

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw new HttpError(409, "Email in use");
};

exports.checkVerificationOnLogin = async (email) => {
  const user = await User.findOne({ email });

  if (!user.verify) throw new HttpError(401, "Email not verified");

  return user;
};

exports.getOneUser = (id) => User.findById(id);
