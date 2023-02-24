const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//Root
app.get('/', (req, res) => {
  res.statusCode = 200
  res.json({
    message: 'root',
  });
});

module.exports = app;
