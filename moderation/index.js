const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'ReplyCreated') {
    const status = data.content.includes('owo') ? 'rejected' : 'approved';
    await axios.post('http://localhost:5005/events', {
      type: 'ReplyModerated',
      data: {
        id: data.id,
        tweetId: data.tweetId,
        status,
        content: data.content,
      },
    });
  }
  res.send({});
});

app.listen(5003, () => {
  console.log('Listening on port 5003');
});
