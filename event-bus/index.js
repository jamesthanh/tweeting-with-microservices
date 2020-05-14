const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('./events', (req, res) => {
  const event = req.body;
  // tweet service
  axios.post('http://localhost:5000/events', event);
  //reply services
  axios.post('http://localhost:5001/events', event);
  // query serivces
  axios.post('http://localhost:5002/events', event);

  res.send({ status: 'OK' });
});

app.listen(5005, () => {
  console.log('Listening on port 4005');
});
