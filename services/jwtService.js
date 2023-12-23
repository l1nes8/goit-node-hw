const jwt = require("jsonwebtoken");
const config = require("../models/config");
const HttpError = require("../utils/HttpErrors");

exports.registerToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpires,
  });

exports.checkToken = (token) => {
  if (!token) throw new HttpError(401, "Not logged in..");

  try {
    const { id } = jwt.verify(token, config.jwtSecret);

    return id;
  } catch (err) {
    throw new HttpError(401, "Not logged in..");
  }
};
