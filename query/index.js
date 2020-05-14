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
    const { id, content, tweetId } = data;

    const tweet = tweets[tweetId];
    tweet.replies.push({ id, content });
  }
  console.log(tweets);
  res.send({});
});

app.listen(5002, () => {
  console.log('Listening on 5002');
});
