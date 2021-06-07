const express = require('express');
const Joi = require("joi");
const pgp = require('pg-promise')();

const userStats = express.Router();

userStats.use(express.json());

const db = pgp({
    database: 'Swipe-if-y'
});




//get only user
userStats.get('/user/:id', async (req, res) => {

    const user = await db.oneOrNone(`SELECT * FROM users WHERE users.id = $(id);`, {

        id: +req.params.id
    })


    if (!user) {
        return res.status(404).send('UserId not found')
    };


    res.status(200).json(user);
});






//get by id for user and their stats
userStats.get('/user/:id', async (req, res) => {

    const user = await db.many(`SELECT u.id, u.name, us.stat_name, us.stat_exp FROM users u
    INNER JOIN user_statistics us ON u.id = us.user_id
    WHERE u.id = $(id);`, {

        id: +req.params.id
    })


    if (!user) {
        return res.status(404).send('UserId not found')
    };


    res.status(200).json(user);
});












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
