const express = require('express');
const app = express();
require("dotenv").config();
const apiKey = process.env.APIKEY;
const port = process.env.PORT

app.use(express.json());

const storedData = {
  kick: [],
  ban: [],
  unban: [],
};

function validateApiKey(req, res) {
  const providedApiKey = req.header('Authorization');
  if (providedApiKey !== apiKey) {
    res.status(401).json({ message: '401 Unauthorized | Invalid API key.' });
    return false;
  }
  return true;
}

function getAndRemoveData(dataArray, res) {
  const data = dataArray.pop();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: 'No data available' });
  }
}

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ message: 'Bad request | Invalid JSON format' });
  } else {
    next();
  }
});

app.route('/data/:type')
  .post((req, res) => {
    if (!validateApiKey(req, res)) return;

    const { userid, reason } = req.body;
    const type = req.params.type;

    if (!userid) {
      return res.status(400).json({ message: "Bad request | Missing userid" });
    }

    switch (type) {
      case 'kick':
      case 'ban':
        if (!reason) {
          return res.status(400).json({ message: "Bad request | Missing reason" });
        }
        if (type === 'kick') {
          storedData.kick.push({ userid, reason });
        } else {
          storedData.ban.push({ userid, reason });
        }
        break;
      case 'unban':
        storedData.unban.push({ userid });
        break;
      default:
        res.status(400).json({ message: 'Bad request | Invalid data type' });
        return;
    }

    res.status(200).json({ message: `${type} data received and stored successfully` });
  })
  .get((req, res) => {
    if (!validateApiKey(req, res)) return;
    
    const type = req.params.type;
    const dataArray = storedData[type];

    if (dataArray) {
      getAndRemoveData(dataArray, res);
    } else {
      res.status(400).json({ message: 'Invalid data type' });
    }
  });



  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
