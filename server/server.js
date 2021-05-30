require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');






const app = express();


const port = 3000;

app.use(express.static(__dirname + '/public'))
    .use(cors())






app.listen(port, () =>
    console.log(`server is running on ${port}`));
