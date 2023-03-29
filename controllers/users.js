const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest } = require('../utils/BadRequest');
const { Conflict } = require('../utils/Conflict');
const { NotFound } = require('../utils/NotFound');
const { Unauthorized } = require('../utils/Unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => next(error));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFound('Запрашиваемый пользователь не найден'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.send({
            name: user.name, about: user.about, avatar: user.avatar, email: user.email,
          });
        })
        .catch((error) => {
          if (error.code === 11000) {
            next(new Conflict('Пользователь с таким емейлом уже зарегистрирован'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequest('Получены неккоретные данные'));
          } else {
            next(error);
          }
        });
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFound('Запрашиваемый пользователь не найден'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFound('Запрашиваемый пользователь не найден'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
          }
          const token = jsonwebtoken.sign({
            _id: user._id,
          }, 'some-secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 604800000,
            httpOnly: true,
          });
          return res.send({
            name: user.name, about: user.about, avatar: user.avatar, email: user.email,
          });
        })
        .catch((error) => {
          next(error);
        });
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      next(error);
    });
};
