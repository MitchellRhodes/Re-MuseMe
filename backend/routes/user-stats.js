const express = require('express');
const Joi = require("joi");
const pgp = require('pg-promise')();

const userStats = express.Router();

userStats.use(express.json());

const db = pgp({
    database: 'Swipe-if-y'
});


//get by id for user and their stats
userStats.get('/user/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id
    })


    if (!user) {
        return res.status(404).send('ID not found')
    };


    res.status(200).json(user);
});





//put for changing stats(may be where i put the if song is has this much danceability then lower danceability and etc)


//post for new users


//delete for removing user

userStats.delete('/user/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id)`, {
        id: +req.params.id,
    })

    if (!user) {
        return res.status(404).send('ID not found')
    };

    const deleteUser = await db.none(`DELETE FROM users WHERE users.id = $(id)`, {
        id: +req.params.id,
    })

    res.status(204).json(deleteUser);
});



















module.exports = userStats;
