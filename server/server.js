require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();


const port = 3000;

app.use(cors());


// app.get('/spotify-login', function (req, res) {
//     const scopes = 'user-read-private user-read-email';
//     res.redirect('https://accounts.spotify.com/authorize' +
//         '?response_type=code' +
//         '&client_id=' + my_client_id +
//         (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//         '&redirect_uri=' + encodeURIComponent(redirect_uri));
// });



app.post('/login', (req, res) => {
    const code = req.body.code

    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })

    //authorizes you have code and returns the token as a json
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        }).catch(() => {
            res.sendStatus(400)
        })
    })
});


app.listen(port, () =>
    console.log(`server is running on ${port}`));
