const userRoute = require("./user.route");
const imageRoute = require("./image.route");

module.exports.routes = (app) => {
  app.use("/user", userRoute);
  app.use("/image", imageRoute);
};
