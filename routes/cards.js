const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', createCard);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.put('/cards/:cardId/likes', likeCard);

cardRouter.delete('/cards/:cardId/likes', unlikeCard);

module.exports = {
  cardRouter,
};
