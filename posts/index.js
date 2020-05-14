const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const tweets = {};

app.get('/tweets', (req, res) => {
  res.send(tweets);
});

app.post('/tweets', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  tweets[id] = {
    id,
    title,
  };
  res.status(201).send(tweets[id]);
});

app.listen(5000, () => {
  console.log('Listenting on port 5000');
});
