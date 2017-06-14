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
    knex('pieces').select('id', 'title', 'scale', 'parts', 'phrase_infos', 'user_id')
    .then((results) => {
        results.forEach(result => {
            result.title = result.title;
            result.scale = result.scale;
            result.parts = JSON.parse(result.parts);
            result.phrase_infos = JSON.parse(result.phrase_infos);
        });
        res.send(camelizeKeys(results));
    }).catch((err) => {
        next(err);
    });
});

router.get('/pieces/:id', (req, res, next) => {
    knex('pieces').select('id', 'title', 'scale', 'parts', 'phrase_infos', 'user_id').where('id', req.params.id).first()
    .then((result) => {
        result.title = result.title;
        result.scale = result.scale;
        result.parts = JSON.parse(result.parts);
        result.phrase_infos = JSON.parse(result.phrase_infos);
        res.send(camelizeKeys(result));
    }).catch((err) => {
        next(err);
    });
});

router.post('/pieces', checkAuth, (req, res, next) => {
    const title = req.body.piece.title;
    const scale = req.body.piece.scale;
    const parts = JSON.stringify(req.body.piece.parts);
    const phraseInfos = JSON.stringify(req.body.piece.phraseInfos);
    const userId = req.token.userId;

    knex('pieces')
    .whereRaw("title ilike ?", [title])     // ensure that title is not duplicated
    .where('user_id', userId)               // in user's pieces
    .then((result) => {
        console.log('result', result);
        if (result.length) {
            throw boom.create(400, 'Duplicate title');
        }
        return knex('pieces').insert(decamelizeKeys({title, scale, parts, phraseInfos, userId}), '*')
    })
    .then((result) => {
        res.send({id: result[0].id, userId: result[0].user_id});
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
            title: req.body.piece.title,
            scale: req.body.piece.scale,
            parts: JSON.stringify(req.body.piece.parts),
            phraseInfos: JSON.stringify(req.body.piece.phraseInfos)
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
