const Card = require('../models/card');
const { BadRequest } = require('../utils/BadRequest');
const { Forbidden } = require('../utils/Forbidden');
const { NotFound } = require('../utils/NotFound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      next(new NotFound('Запрашиваемая карточка не найдена'));
    })
    .then((card) => {
      if (card.owner === req.user._id) {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.send(card);
          })
          .catch((error) => {
            next(error);
          });
      }
      next(new Forbidden('Нельзя удалить чужую карточку'));
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else if (error.name === 'NotFound') {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } else if (error.name === 'Forbidden') {
        next(new Forbidden('Нельзя удалить чужую карточку'));
      } else {
        next(error);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFound('Запрашиваемая карточка не найдена'));
    })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else if (error.name === 'Error') {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } else {
        next(error);
      }
    });
};

module.exports.unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFound('Запрашиваемая карточка не найдена'));
    })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Получены неккоретные данные'));
      } else if (error.name === 'Error') {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } else {
        next(error);
      }
    });
};
