const mongoose = require("mongoose");
const app = require("./app");
const config = require("./models/config");

mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoURI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
