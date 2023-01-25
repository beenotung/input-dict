import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('word'))) {
    await knex.schema.createTable('word', table => {
      table.increments('id')
      table.text('char').notNullable().unique()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('word')
}
