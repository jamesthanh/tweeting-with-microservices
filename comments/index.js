const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const repliesByTweetId = {};

app.get('/tweets/:id/replies', (req, res) => {
  res.send(repliesByTweetId[req.params.id] || []);
});

app.post('/tweets/:id/replies', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;

  const tweets = repliesByTweetId[req.params.id] || [];
  tweets.push({ id: id, content });
  repliesByTweetId[req.params.id] = tweets;
  res.status(201).send(tweets);
});

app.listen(5001, () => {
  console.log('Listening on 5001');
});
