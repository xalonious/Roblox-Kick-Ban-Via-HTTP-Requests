const express = require("express");
const router = express.Router();
const apiKey = process.env.APIKEY;

const storedData = {
  kick: {},
  ban: {},
  unban: {},
};



function validateApiKey(req, res) {
    const providedApiKey = req.header.authorization;
    if (providedApiKey !== apiKey) {
      res.status(401).json({ message: '401 Unauthorized | Invalid API key.' });
      return false;
    }
    return true;
  }
  


router.route('/data/:type')
  .post((req, res) => {
    if (!validateApiKey(req, res)) return;

    const { userid, reason } = req.body;
    const type = req.params.type;

    if (!userid) {
      return res.status(400).json({ message: "Bad request | Missing userid" });
    }

    const userData = storedData[type][userid] ?? [];
    userData.push({ userid, reason });
    storedData[type][userid] = userData;

    res.status(200).json({ message: `${type} data received and stored successfully` });
  })
  .get((req, res) => {
    if (!validateApiKey(req, res)) return;

    const type = req.params.type;
    const dataByUserid = storedData[type];

    const oldestData = Object.values(dataByUserid)
      .map(dataArray => dataArray[0])
      .filter(Boolean);

    if (oldestData.length > 0) {
      oldestData.forEach(data => {
        const { userid } = data;
        dataByUserid[userid] = dataByUserid[userid].slice(1);
      });
      res.status(200).json(oldestData);
    } else {
      res.status(404).json({ message: 'No data available' });
    }
  });

module.exports = router;