const express = require('express');
const Joi = require("joi");
const pgp = require('pg-promise')();

const userStats = express.Router();

userStats.use(express.json());

const db = pgp({
    database: 'Swipe-if-y'
});


module.exports = userStats;
