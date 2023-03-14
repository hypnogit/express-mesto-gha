const Card = require('../models/card');
const { serverError, notFoundError, incorrectInputError } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => res.status(serverError).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(notFoundError).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(incorrectInputError).send({ message: 'Получены неккоретные данные' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(notFoundError).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(notFoundError).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(serverError).send({ message: 'Произошла ошибка' });
      }
    });
};