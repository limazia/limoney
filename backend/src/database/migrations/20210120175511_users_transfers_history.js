exports.up = function (knex) {
  return knex.schema.createTable("users_transfers_history", (table) => {
    table.string("history_id").primary();
    table.string("history_from").notNullable();
    table.string("history_to").notNullable();
    table.string("history_value").notNullable();
 
    table.timestamp("updateAt").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp("createdAt").defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users_transfers_history");
};
