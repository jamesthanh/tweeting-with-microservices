const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
// sdasd

app.post('/events', (req, res) => {
  const event = req.body;
  // tweet service
  axios.post('http://posts-clusterip-srv:5000/events', event);
  //reply services
  axios.post('http://comments-srv:5001/events', event);
  // query serivces
  axios.post('http://query-srv:5002/events', event);
  // moderation serivces
  axios.post('http://moderation:5003/events', event);

  res.send({ status: 'OK' });
});

app.listen(5005, () => {
  console.log('Listening on port 5005');
});
