import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw('alter table `word` add column `code` text not null')
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('alter table `word` drop column `code`')
}
