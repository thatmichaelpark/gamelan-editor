'use strict';

exports.seed = function(knex) {
    return knex('users').del().then(() => {
        return knex('users').insert([
            {
                id: 1,
                username: 'test',
                name: 'Testy McTestface',
                hashed_password: '$2a$12$.MOSyQV85SWJrkyGTpRpGesPP6K4vt4mQspGuJvi5rK0THBFZF/y2'
            }
        ]);
    }).then(() => {
        return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
    });
};
