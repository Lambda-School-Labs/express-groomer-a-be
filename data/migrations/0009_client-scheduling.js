exports.up = async (knex) => {
  await knex.schema.createTable('scheduling', (table) => {
    table.increments('transaction').primary();
    table
      .string('customer_id')
      .references('user_id')
      .inTable('customer')
      .onDelete('cascade')
      .onUpdate('cascade')
      .notNull();
    table
      .string('groom_id')
      .references('user_id')
      .inTable('groomer')
      .onDelete('cascade')
      .onUpdate('cascade')
      .notNull();
    table.boolean('confirmation').defaultTo(null);
    table.date('date', { useTz: false }).notNull();
    table.time('startTime').notNull();
    table.time('endTime').notNull();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('scheduling');
};
