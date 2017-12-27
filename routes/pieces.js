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
    knex('pieces').select('id', 'title', 'scale', 'user_id', 'is_public')
    .then((results) => {
        res.send(camelizeKeys(results));
    }).catch((err) => {
        next(err);
    });
});

router.get('/pieces/:id', (req, res, next) => {
    knex('pieces').select('id', 'title', 'scale', 'bpm', 'parts', 'phrase_infos', 'phrase_playlist', 'tempo_points', 'user_id').where('id', req.params.id).first()
    .then((result) => {
        result.parts = JSON.parse(result.parts);
        result.phrase_infos = JSON.parse(result.phrase_infos);
        result.phrase_playlist = JSON.parse(result.phrase_playlist);
        result.tempo_points = JSON.parse(result.tempo_points);
        res.send(camelizeKeys(result));
    }).catch((err) => {
        next(err);
    });
});

router.post('/pieces', checkAuth, (req, res, next) => {
    const { title, scale, bpm } = req.body.piece;
    
    const parts = JSON.stringify(req.body.piece.parts);
    const phraseInfos = JSON.stringify(req.body.piece.phraseInfos);
    const phrasePlaylist = JSON.stringify(req.body.piece.phrasePlaylist);
    const tempoPoints = JSON.stringify(req.body.piece.tempoPoints);
    const userId = req.token.userId;

    knex('pieces')
    .whereRaw("title ilike ?", [title])     // ensure that title is not duplicated
    .where('user_id', userId)               // in user's pieces
    .then((result) => {
        if (result.length) {
            throw boom.create(400, 'Duplicate title');
        }
        return knex('pieces').insert(decamelizeKeys({title, scale, parts, bpm, phraseInfos, phrasePlaylist, tempoPoints, userId}), '*')
    })
    .then((result) => {
        res.send({id: result[0].id, userId: result[0].user_id});
    }).catch((err) => {
        next(err);
    });
});

// put: should ensure that user is piece's owner and that title occurs among the user's pieces at
// most one time, in the piece being patched (it might occur 0 times if the patch changes the title)

router.put('/pieces/:id', checkAuth, (req, res, next) => {
    const { title, scale, bpm, isPublic } = req.body.piece;
    const parts = JSON.stringify(req.body.piece.parts);
    const phraseInfos = JSON.stringify(req.body.piece.phraseInfos);
    const phrasePlaylist = JSON.stringify(req.body.piece.phrasePlaylist);
    const tempoPoints = JSON.stringify(req.body.piece.tempoPoints);
    const userId = req.token.userId;

    knex('pieces').select('user_id').where('id', req.params.id).first()
    .then(result => {
        const ownerId = camelizeKeys(result).userId;

        if (ownerId !== req.token.userId) {      // Ensure that piece belongs to user
            throw boom.create(401, 'Not allowed to modify this piece');
        }

        return knex('pieces').select('id')
        .whereRaw("title ilike ?", [title])     // Ensure that title is not duplicated
        .where('user_id', userId);              // in user's pieces
    })
    .then((ids) => {
        if (ids.length > 1 || (ids.length === 1 && ids[0].id !== Number(req.params.id))) {
            throw boom.create(400, 'Duplicate title');
        }

        return knex('pieces')
            .update(decamelizeKeys({title, scale, bpm, parts, phraseInfos, phrasePlaylist, tempoPoints, isPublic}), ['id', 'user_id'])
            .where('id', req.params.id);
    })
    .then((ids) => {
        res.send(camelizeKeys(ids[0]));
    }).catch((err) => {
        next(err);
    });
});

router.delete('/pieces/:id', checkAuth, (req, res, next) => {
    // if (!req.token.isAdmin) {
    //     return next(boom.create(401, 'Not logged in as admin'));
    // }

    knex('pieces').select('user_id').where('id', req.params.id).first()
    .then(result => {
        const ownerId = camelizeKeys(result).userId;

        if (ownerId !== req.token.userId) {
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
    .then(result => {
        res.send(`${result} deleted`);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
