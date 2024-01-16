const serverConfig = {
  mongoURI: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES,
};

module.exports = serverConfig;
