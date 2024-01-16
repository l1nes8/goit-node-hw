const {
  registerUser,
  loginUser,
  logoutUser,
  updateAvatar,
  verifyEmail,
  sendVerificationEmail,
} = require("../services/user.js");

const { checkVerificationOnLogin } = require("../services/authServices.js");

exports.register = async (req, res, next) => {
  const { email, password, token } = req.body;
  try {
    const user = await registerUser({ email, password });
    await sendVerificationEmail(user.user);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password, token } = req.body;

  try {
    await checkVerificationOnLogin(email);

    const user = await loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const userId = req.body.id;

  try {
    await logoutUser(userId);
    res.status(204).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    const updatedUser = await updateAvatar(req.body, req.user, req.file);
    const avatarURL = `/${updatedUser.avatar}`;
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const result = await verifyEmail(verificationToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  const { user } = req;

  try {
    await sendVerificationEmail(user);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
