'use strict';

exports.seed = function(knex) {
    return knex('users').del().then(() => {
        return knex('users').insert([
            {
                id: 1,
                username: 'admin',
                name: 'Administrator',
                is_admin: true,
                hashed_password: '$2a$12$YD2KiWMqD/qWiFQjjFbPdeDxiE71SW8YCTfk6l16jvlStEFOP3pRu'
            },
            {
                id: 2,
                username: 'peter',
                name: 'Peter J. Park',
                is_admin: true,
                hashed_password: '$2a$12$.MOSyQV85SWJrkyGTpRpGesPP6K4vt4mQspGuJvi5rK0THBFZF/y2'
            },
            {
                id: 3,
                username: 'michael',
                name: 'Michael Park',
                is_admin: false,
                hashed_password: '$2a$12$.MOSyQV85SWJrkyGTpRpGesPP6K4vt4mQspGuJvi5rK0THBFZF/y2'
            }
        ]);
    }).then(() => {
        return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
    });
};
