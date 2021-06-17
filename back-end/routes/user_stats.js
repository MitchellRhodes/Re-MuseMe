const express = require('express');
const Joi = require("joi");
const pgp = require('pg-promise')();

const userStats = express.Router();

userStats.use(express.json());

const db = pgp({
    database: 'Swipe-if-y'
});



function validateSwipe(swipe) {
    const schema = Joi.object({
        user_id: Joi.number().min(1).required(),
        song_id: Joi.number().min(1).required(),
        swipe: Joi.boolean()
    });

    return schema.validate(swipe);
};

//uses joi to insure the user is posted with the correct info 
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        email: Joi.string().min(1).required()
    });

    return schema.validate(user);
};

//get all users
userStats.get('/user', async (req, res) => {

    const users = await db.many(`SELECT * FROM users;`)


    if (!users) {
        return res.status(404).send('Users not found')
    };


    res.status(200).json(users);
});




//get only the user
userStats.get('/user/:email', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.email = $(email);`, {

        email: req.params.email
    })


    if (!user) {
        return res.status(404).send('User Email not found')
    };


    res.status(200).json(user);
});



//turn song id string into songId number
userStats.get('/song/:id', async (req, res) => {

    const songId = await db.oneOrNone(`SELECT id FROM song_stats WHERE song_id = $(id);`, {

        id: req.params.id
    })


    if (!songId) {
        return res.status(404).send('songId not found')
    };


    res.status(200).json(songId);
});




//get average of all of a single user's swipe data when swipe is true
userStats.get('/user-stats/:id', async (req, res) => {
    const userStats = await db.oneOrNone(`SELECT s.user_id, AVG(danceability) as danceability, AVG(energy) as energy, AVG(acousticness) as acousticness,
        AVG(instrumentalness) as instrumentalness, AVG(valence) as valence 
        FROM swipes s
        INNER JOIN song_stats ss ON ss.id = s.song_id
        WHERE s.user_id = $(id) AND s.swipe = true
        GROUP BY s.user_id;`, {
        id: +req.params.id
    })

    if (!userStats) {
        return res.status(404).send('UserId not found')
    };

    res.status(200).json(userStats);
});




//get every songID for matchmaker random that will only return songs not swiped on by user (have 50 limit but currently reduced for my sanity)

userStats.get('/user/:id/song-data', async (req, res) => {

    const songIds = await db.many(`Select * from song_stats
    where NOT id IN (
        select swipes.song_id from swipes 
        INNER JOIN song_stats ON swipes.song_id = song_stats.id
        where song_stats.id = swipes.song_id AND user_id = $(id) )
        ORDER BY RANDOM()
        LIMIT 5`, {
        id: +req.params.id
    });

    res.status(200).json(songIds)
});




//get song data
userStats.get('/song-data/:id', async (req, res) => {

    const songData = await db.oneOrNone(`select danceability, energy, acousticness, instrumentalness, valence FROM song_stats WHERE song_id = $(id); `, {

        id: req.params.id
    })

    if (!songData) {

        return res.status(404).send('Song analytics were not found')
    };

    res.status(200).json(songData);
})


//get all swipes for a user
userStats.get('/user/:id/swipes', async (req, res) => {

    const swipes = await db.many(`SELECT * FROM swipes WHERE user_id = $(id)`, {
        id: +req.params.id
    })

    res.status(200).json(swipes);
});




//post for new users
userStats.post('/user', async (req, res) => {

    const validation = validateUser(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };


    await db.none(`INSERT INTO users (name,email) VALUES($(name), $(email))`, {
        name: req.body.name,
        email: req.body.email
    })

    const user = await db.one(`SELECT * FROM users WHERE email = $(email)`, {
        name: req.body.name,
        email: req.body.email
    })


    res.status(201).json(user);
});



//post song from spotify when they like it
userStats.post('/song-data', async (req, res) => {

    const validation = validateSong(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };


    await db.none(`INSERT INTO song_stats (song_id, danceability,energy,speechiness,acousticness,instrumentalness,liveness,valence) VALUES($(song_id), $(danceability),$(energy),$(speechiness),$(acousticness),$(instrumentalness),$(liveness),$(valence))`, {
        song_id: req.body.song_id,
        danceability: req.body.danceability,
        energy: req.body.energy,
        speechiness: req.body.speechiness,
        acousticness: req.body.acousticness,
        instrumentalness: req.body.instrumentalness,
        liveness: req.body.liveness,
        valence: req.body.valence
    })

    const song = await db.one(`SELECT * FROM song_stats WHERE song_id = $(song_id)`, {
        song_id: req.body.song_id
    })


    res.status(201).json(song);
});



function validateSong(songStat) {
    const schema = Joi.object({

        song_id: Joi.string().min(1).required(),
        danceability: Joi.number().precision(22).required(),
        energy: Joi.number().precision(22).required(),
        speechiness: Joi.number().precision(22).required(),
        acousticness: Joi.number().precision(22).required(),
        instrumentalness: Joi.number().precision(22).required(),
        liveness: Joi.number().precision(22).required(),
        valence: Joi.number().precision(22).required()
    });

    return schema.validate(songStat);
};





//change user info
userStats.put('/user/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id);`, {

        id: +req.params.id
    })

    if (!user) {
        return res.status(404).send('UserID not found')
    }

    const validation = validateUser(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };

    await db.oneOrNone(`UPDATE users SET name = $(name), email = $(email) WHERE id = $(id) `, {
        id: +req.params.id,
        name: req.body.name,
        email: req.body.email
    })

    res.status(200).json(user);

});



//post user's swipe on song if swipe true then song analytics change one way
userStats.post('/swipes', async (req, res) => {

    const validation = validateSwipe(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };


    await db.none(`INSERT INTO swipes (user_id,song_id,swipe) VALUES($(user_id),$(song_id), $(swipe))`, {
        user_id: req.body.user_id,
        song_id: req.body.song_id,
        swipe: req.body.swipe
    })

    const swipe = await db.one(`SELECT * FROM swipes WHERE song_id = $(song_id)`, {
        user_id: req.body.user_id,
        song_id: req.body.song_id,
        swipe: req.body.swipe
    })


    res.status(201).json(swipe);


});




//update a swipe
userStats.put('/user/:userId/swipes/:id', async (req, res) => {

    const swipe = await db.oneOrNone(`SELECT * FROM swipes WHERE song_id = $(id);`, {

        id: +req.params.id
    })

    if (!swipe) {
        return res.status(404).send('Swipe not found')
    }


    const validation = validateSwipe(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };

    await db.oneOrNone(`UPDATE swipes SET user_id = $(user_id), song_id = $(song_id), swipe = $(swipe) WHERE song_id = $(id) AND user_id = $(userId)`, {
        id: +req.params.id,
        userId: +req.params.userId,
        user_id: req.body.user_id,
        song_id: req.body.song_id,
        swipe: req.body.swipe
    })


    res.status(200).json(swipe);


});



function validateSwipe(swipe) {
    const schema = Joi.object({
        user_id: Joi.number().min(1).required(),
        song_id: Joi.number().min(1).required(),
        swipe: Joi.boolean()
    });

    return schema.validate(swipe);
};





//delete for removing user

userStats.delete('/user/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id,
    })

    if (!user) {
        return res.status(404).send('UserId not found')
    };

    const deleteUser = await db.none(`DELETE FROM users WHERE users.id = $(id)`, {
        id: +req.params.id,
    })

    res.status(204).json(deleteUser);
});

















module.exports = userStats;