const express = require('express');
const bodyParser = require('body-parser');
const jsonValidator = require('./middleware/jsonValidator');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const app = express();
const port = 8080; 


app.use(bodyParser.json());
app.use(jsonValidator);


const routesDir = path.join(__dirname, 'routes');

fs.readdirSync(routesDir).forEach((file) => {
  const routePath = path.join(routesDir, file);
  const routeModule = require(routePath);
  app.use('/', routeModule);
});

app.listen(port, async() => {
  console.log(`Server is running on port ${port}`);
});
