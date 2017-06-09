'use strict';

exports.up = function(knex) {
    return knex.schema.createTable('pieces', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.string('scale').notNullable();
        table.string('parts', 10000).notNullable();
        table.string('phrase_infos', 10000).notNullable();
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
