const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

// sadasd
const app = express();
app.use(bodyParser.json());
app.use(cors());

const repliesByTweetId = {};

app.get('/tweets/:id/replies', (req, res) => {
  res.send(repliesByTweetId[req.params.id] || []);
});

app.post('/tweets/:id/replies', async (req, res) => {
  try {
    const tweetId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const tweets = repliesByTweetId[req.params.id] || [];
    tweets.push({ id: tweetId, content });
    repliesByTweetId[req.params.id] = tweets;
    await axios.post('http://localhost:5005/events', {
      type: 'ReplyCreated',
      data: {
        id: tweetId,
        content,
        tweetId: req.params.id,
      },
    });
    res.status(201).send(tweets);
  } catch (err) {
    // console.log(err);
  }
});

app.post('/events', (req, res) => {
  console.log('Got event: ', req.body.type);
  res.send({});
});

app.listen(5001, () => {
  console.log('Listening on 5001');
});
