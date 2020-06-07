const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const tweets = {};

app.get('/tweets', (req, res) => {
  res.send(tweets);
});
//asdsd

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === 'TweetCreated') {
    const { id, title } = data;
    tweets[id] = { id, title, replies: [] };
  }

  if (type === 'ReplyCreated') {
    const { id, content, tweetId, status } = data;

    const tweet = tweets[tweetId];
    tweet.replies.push({ id, content, status });
  }
  if (type === 'ReplyUpdated') {
    const { id, content, tweetId, status } = data;
    const tweet = tweets[tweetId];
    const reply = tweet.replies.find((reply) => {
      return reply.id === id;
    });
    reply.status = status;
    reply.content = content;
  }
  console.log(tweets);
  res.send({});
});

app.listen(5002, async () => {
  console.log('Listening on 5002');

  const res = await axios.get('http://event-bus-srv:5005/events');

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
  }
});
