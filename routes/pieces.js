'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
// const ev = require('express-validation');
// const validations = require('../validations/pieces');
const {checkAuth} = require('./checkAuth');

router.get('/pieces', (req, res, next) => {
    knex('pieces').select('id', 'piece', 'user_id')
    .then((results) => {
        results.forEach(result => {
            result.piece = JSON.parse(result.piece);
        });
        res.send(camelizeKeys(results));
    }).catch((err) => {
        next(err);
    });
});

router.get('/pieces/:id', (req, res, next) => {
    knex('pieces').select('id', 'piece', 'user_id').where('id', req.params.id).first()
    .then((result) => {
        result.piece = JSON.parse(result.piece);
        res.send(camelizeKeys(result));
    }).catch((err) => {
        next(err);
    });
});

router.post('/pieces', checkAuth, (req, res, next) => {
    const piece = JSON.stringify(req.body.piece);
    const userId = req.token.userId;

    knex('pieces').insert(decamelizeKeys({piece, userId}), '*')
    .then((result) => {
        res.send({id: result[0].id});
    }).catch((err) => {
        next(err);
    });
});

router.patch('/pieces/:id', checkAuth, (req, res, next) => {
    if (!req.token.isAdmin) {
        return next(boom.create(401, 'Not logged in as admin'));
    }

    knex('pieces').select('user_id').where('id', req.params.id).first()
    then((userId) => {
        if (userId !== req.token.userId) {
            return next(boom.create(401, 'Not allowed to modify this piece'));
        }
        return knex('pieces').update({
            piece: req.body.piece
        }, ['id']).where('id', req.params.id);
    })
    .then((ids) => {
        res.send(ids[0]);
    }).catch((err) => {
        next(err);
    });
});

router.delete('/pieces/:id', checkAuth, (req, res, next) => {
    if (!req.token.isAdmin) {
        return next(boom.create(401, 'Not logged in as admin'));
    }

    knex('pieces').select('user_id').where('id', req.params.id).first()
    then((userId) => {
        if (userId !== req.token.userId) {
            return next(boom.create(401, 'Not allowed to delete this piece'));
        }

        return knex('pieces').where('id', req.params.id).first();
    })
    .then((piece) => {
        if (!piece) {
            throw boom.create(400, 'Could not delete');
        }

        return knex('pieces').del().where('id', req.params.id);
    })
    .then(() => {
        res.send(piece.id);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
