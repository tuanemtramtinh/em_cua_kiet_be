module.exports = function (req, res, next) {
  res.success = (data, message = 'OK') =>
    res.status(200).json({ status: 'success', message, data });

  res.error = (message = 'Error', code = 500) =>
    res.status(code).json({ status: 'error', message });

  res.badRequest = (message = 'Bad Request') => res.error(message, 400);

  next();
};
