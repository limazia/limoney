exports.up = function (knex) {
  return knex.schema.createTable("users_balance", (table) => {
    table
      .string("balance_user")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .primary();
    table.integer("balance_money", 0).notNullable();
    
    table.timestamp("updateAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.timestamp("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users_balance");
};