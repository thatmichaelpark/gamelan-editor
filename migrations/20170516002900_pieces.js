'use strict';

exports.up = function(knex) {
    return knex.schema.createTable('pieces', (table) => {
        table.increments();
        table.string('piece', 10000).notNullable().defaultTo('');
        table.integer('user_id')
          .notNullable()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .index();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('pieces');
};
