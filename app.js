const express = require('express');
const mongoose = require('mongoose');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '640f439bddfe92e9c420bbf4',
  };
  next();
});

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Такая страница не найдена' });
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
