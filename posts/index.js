const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
// sdassdads
const app = express();
app.use(bodyParser.json());
app.use(cors());

const tweets = {};

app.get('/tweets', (req, res) => {
  res.send(tweets);
});

app.post('/tweets', async (req, res) => {
  try {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    tweets[id] = {
      id,
      title,
    };
    await axios.post('http://localhost:5005/events', {
      type: 'TweetCreated',
      data: {
        id,
        title,
      },
    });
    res.status(201).send(tweets[id]);
  } catch (err) {
    console.log(err);
  }
});

app.post('/events', (req, res) => {
  console.log('Got event: ', req.body.type);
  res.send({});
});

app.listen(5000, () => {
  console.log('Listenting on port 5000');
});
