'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const boom = require('boom');
const {camelizeKeys} = require('humps');
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/token', (req, res, next) => {
    let user;

    knex('users').where('username', req.body.username).first().then((row) => {
        if (!row) {
            throw boom.create(401, 'User could not be logged in');
        }

        user = camelizeKeys(row);

        return bcrypt.compare(req.body.password, user.hashedPassword);
    }).then(() => {
        const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hrs
        const token = jwt.sign({
            username: req.body.username,
            userId: user.id
        }, process.env.JWT_SECRET, {
            expiresIn: '3h'
        });

        res.cookie('gamelanAccessToken', token, {
            httpOnly: true,
            expires: expiry,
            secure: router.get('env') === 'production'
        });

        res.cookie('gamelanLoggedIn', true, {
            expires: expiry,
            secure: router.get('env') === 'production'
        });

        res.cookie('gamelanName', user.name, {
            expires: expiry,
            secure: router.get('env') === 'production'
        });

        res.cookie('gamelanUsername', user.username, {
            expires: expiry,
            secure: router.get('env') === 'production'
        });

        res.send({name: user.name, username: user.username});
    }).catch(bcrypt.MISMATCH_ERROR, () => {
        throw boom.create(401, 'User could not be logged in');
    }).catch((err) => {
        next(err);
    });
});

router.delete('/token', (req, res) => {
    res.clearCookie('gamelanAccessToken');
    res.clearCookie('gamelanLoggedIn');
    res.clearCookie('gamelanName');
    res.clearCookie('gamelanUsername');

    res.sendStatus(200);
});

module.exports = router;
