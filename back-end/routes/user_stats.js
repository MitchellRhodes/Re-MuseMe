const express = require('express');
const Joi = require("joi");
const pgp = require('pg-promise')();

const userStats = express.Router();

userStats.use(express.json());

const db = pgp({
    database: 'Swipe-if-y'
});




//get only the user
userStats.get('/user/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id);`, {

        id: +req.params.id
    })


    if (!user) {
        return res.status(404).send('UserId not found')
    };


    res.status(200).json(user);
});





//get every songID for matchmaker random
userStats.get('/song-data', async (req, res) => {
    const songIds = await db.many(`select song_id FROM song_stats`)

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









//post for new users (may hardcode beginning stats in here)
userStats.post('/user', async (req, res) => {

    const validation = validateUser(req.body);

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };


    await db.none(`INSERT INTO users (name) VALUES($(name))`, {
        name: req.body.name
    })

    const user = await db.one(`SELECT * FROM users WHERE name = $(name)`, {
        name: req.body.name
    })


    res.status(201).json(user);
});

//uses joi to insure the user is posted with the correct info 
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
    });

    return schema.validate(user);
};




//post user's swipe on song if swipe true then song analytics change one way, and if flase they change another way
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


    res.status(201).json(item);


});

function validateSwipe(swipe) {
    const schema = Joi.object({
        user_id: Joi.number().min(1).required(),
        song_id: Joi.string().min(1).required(),
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