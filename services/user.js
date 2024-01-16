const User = require("../models/userSchem");
const HttpError = require("../utils/HttpErrors");
const { registerToken } = require("./jwtService");
const ImageService = require("./imageServices");
const nodemailer = require("nodemailer");
const uuid = require("uuid").v4;

const generateVerificationToken = () => {
  return uuid();
};

const registerUser = async (data) => {
  const newUserData = {
    ...data,
    verificationToken: generateVerificationToken(),
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

const updateAvatar = async (userData, user, file) => {
  if (file) {
    user.avatar = await ImageService.saveImage(
      file,
      { maxFileSize: 1.2 },
      user.id
    );
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

const sendVerificationEmail = async (user) => {
  const verificationToken = user.verificationToken;

  require("dotenv").config();

  const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
    tls: { rejectUnauthorized: false },
  };

  const transporter = nodemailer.createTransport(config);

  const verificationLink = `${process.env.BASE_URL}/users/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.email,
    to: user.email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: ${verificationLink}`,
  };

  transporter
    .sendMail(mailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

const verifyEmail = async (verificationToken) => {
  const user = await User.findOneAndUpdate(
    { verificationToken },
    { $set: { verificationToken: null, verify: true } },
    { new: true }
  );

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return { message: "Verification successful" };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateAvatar,
  verifyEmail,
  sendVerificationEmail,
};
