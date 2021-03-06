'use strict';

exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments();
        table.string('username').notNullable().defaultTo('');
        table.string('name').notNullable().defaultTo('');
        table.bool('is_admin').notNullable();
        table.specificType('hashed_password', 'char(60)').notNullable().defaultTo('');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
