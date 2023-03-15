const User = require('../models/user');
const { serverError, notFoundError, incorrectInputError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('Запрашиваемый пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(incorrectInputError).send({ message: 'Получены неккоретные данные' });
      } else if (error.name === 'Error') {
        res.status(notFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(incorrectInputError).send({ message: 'Получены неккоретные данные' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(incorrectInputError).send({ message: 'Получены неккоретные данные' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(incorrectInputError).send({ message: 'Получены неккоретные данные' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};
