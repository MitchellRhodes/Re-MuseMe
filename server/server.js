const express = require('express');
const cors = require('cors');
const app = express();


const port = 3000;

app.use(cors());


app.get('api/public', function (req, res) {
    res.send('No access token');
});

app.get('api/authorized', function (req, res) {
    res.send('Secured Resource');
});


app.listen(port, () =>
    console.log(`server is running on ${port}`));
