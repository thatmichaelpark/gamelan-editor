'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/users');
const {checkAuth} = require('./checkAuth');

router.get('/users', (req, res, next) => {
    knex('users').select('username', 'name', 'id', 'is_admin').then((users) => {
        res.send(camelizeKeys(users));
    }).catch((err) => {
        next(err);
    });
});

router.get('/users/:id', (req, res, next) => {
    knex('users').select('username', 'name', 'id', 'is_admin').where('id', req.params.id).then((users) => {
        res.send(users[0]);
    }).catch((err) => {
        next(err);
    });
});

router.post('/users', ev(validations.post), (req, res, next) => {
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;

    knex('users').where('username', username).then((users) => {
        if (users.length > 0) {
            throw boom.create(400, 'Username already exists');
        }

        return bcrypt.hash(password, 12);
    }).then((hashedPassword) => {
        return knex('users').insert(decamelizeKeys({username, name, hashedPassword, isAdmin}), '*');
    }).then((result) => {
        res.send({username: result[0].username, id: result[0].id});
    }).catch((err) => {
        next(err);
    });
});

router.patch('/users/:id', checkAuth, ev(validations.patch), (req, res, next) => {
    if (req.token.username !== 'admin') {
        return next(boom.create(401, 'Not logged in as admin'));
    }

    knex('users').update({
        username: req.body.username
    }, ['id', 'username']).where('id', req.params.id).then((users) => {
        res.send(users[0]);
    }).catch((err) => {
        next(err);
    });
});

router.delete('/users/:id', checkAuth, (req, res, next) => {
    if (req.token.username !== 'admin') {
        return next(boom.create(401, 'Not logged in as admin'));
    }

    knex('users').where('id', req.params.id).first().then((user) => {
        if (!user) {
            throw boom.create(400, 'Could not delete');
        }

        return knex('users').del().where('id', req.params.id).then(() => {
            res.send(user.username);
        });
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
