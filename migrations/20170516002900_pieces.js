'use strict';

exports.up = function(knex) {
    return knex.schema.createTable('pieces', (table) => {
        table.increments();
        table.bool('is_active').notNullable().defaultTo(true);
        table.bool('is_public').notNullable().defaultTo(true);
        table.string('title').notNullable();
        table.string('scale').notNullable();
        table.integer('bpm').notNullable();
        table.string('parts', 20000).notNullable();
        table.string('phrase_infos', 20000).notNullable();
        table.string('phrase_playlist', 20000).notNullable();
        table.string('tempo_points', 20000).notNullable();
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
