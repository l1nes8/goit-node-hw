const User = require("../models/userSchem");
const HttpError = require("../utils/HttpErrors");

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw new HttpError(409, "Email in use");
};

exports.getOneUser = (id) => User.findById(id);
