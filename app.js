const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
const { NotFound } = require('./utils/NotFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  const message = statusCode === 500 ? 'Ошибка сервера' : error.message;
  res.status(statusCode).send({ message });
  next();
});

async function start() {
  try {
    mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

    app.listen(PORT, () => {
      console.log('heyy');
    });
  } catch (error) {
    console.log(error);
  }
}

start();
