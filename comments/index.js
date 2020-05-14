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
    tweets.push({ id: tweetId, content, status: 'pending' });
    repliesByTweetId[req.params.id] = tweets;
    await axios.post('http://localhost:5005/events', {
      type: 'ReplyCreated',
      data: {
        id: tweetId,
        content,
        tweetId: req.params.id,
        status: 'pending',
      },
    });
    res.status(201).send(tweets);
  } catch (err) {
    // console.log(err);
  }
});

app.post('/events', async (req, res) => {
  console.log('Got event: ', req.body.type);
  const { type, data } = req.body;
  if (type === 'ReplyModerated') {
    const { tweetId, id, status, content } = data;
    const replies = repliesByTweetId[tweetId];
    const reply = replies.find((reply) => {
      return reply.id === id;
    });
    reply.status = status;
    await axios.post('http://localhost:5005/events', {
      type: 'ReplyUpdated',
      data: {
        id,
        status,
        tweetId,
        content,
      },
    });
  }
  res.send({});
});

app.listen(5001, () => {
  console.log('Listening on 5001');
});
