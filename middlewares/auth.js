const jsonwebtoken = require('jsonwebtoken');
const { Unauthorized } = require('../utils/Unauthorized');

module.exports.auth = (req, res, next) => {
  if (!req.headers.cookie) {
    return next(new Unauthorized('Ошибка авторизации'));
  }
  const token = req.headers.cookie.slice(4);
  let payload;
  try {
    payload = jsonwebtoken.verify(token, 'some-secret-key');
  } catch (error) {
    next(error);
  }
  req.user = payload;
  return next();
};