const userRoute = require('./user.route');

module.exports.routes = (app) => {
  app.use('/user', userRoute);
};