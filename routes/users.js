const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo, createUser, login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z()]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]*)/),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), createUser);

userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), login);

userRouter.use(auth);

userRouter.get('/users/me', getUserInfo);

userRouter.get('/users', getUsers);

userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUserById);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z()]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]*)/),
  }),
}), updateProfile);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z()]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]*)/),
  }),
}), updateAvatar);

module.exports = {
  userRouter,
};
