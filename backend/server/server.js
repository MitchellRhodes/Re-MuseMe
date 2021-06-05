require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const database = require('../database/database');
database.initialize(); //database first so that you can make sure it is live before you run server.





const port = 3000;

app.use(express.static(__dirname + '/public'))
    .use(cors())






app.listen(port, () =>
    console.log(`server is running on ${port}`));
