const { registerUser, loginUser, logoutUser } = require("../services/user.js");

exports.register = async (req, res, next) => {
  const { email, password, token } = req.body;
  try {
    const user = await registerUser({ email, password });
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password, token } = req.body;

  try {
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
