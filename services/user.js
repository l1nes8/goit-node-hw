const User = require("../models/userSchem");
const HttpError = require("../utils/HttpErrors");
const { registerToken } = require("./jwtService");

const registerUser = async (data) => {
  const newUserData = {
    ...data,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = registerToken(newUser.id);

  return { user: newUser, token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new HttpError(401, "Email or password is wrong");

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) throw new HttpError(401, "Email or password is wrong");

  user.password = undefined;

  const token = registerToken(user.id);

  return { user, token };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new HttpError(401, "Not authorized");

  user.token = undefined;

  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
