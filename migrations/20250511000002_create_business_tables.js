/**
 * Migration: Create business data tables
 * Tables: kpis, trends, alerts, integrations
 */

exports.up = async function (knex) {
  // KPIs table
  await knex.schema.createTable('kpis', (table) => {
    table.increments('id').primary();
    table.string('metric', 100).notNullable();
    table.decimal('value', 15, 2).notNullable();
    table.timestamp('timestamp').notNullable();
    table.integer('project_id').unsigned().nullable();
    table.json('metadata').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.index(['metric']);
    table.index(['timestamp']);
    table.index(['project_id']);
  });

  // Trends table
  await knex.schema.createTable('trends', (table) => {
    table.increments('id').primary();
    table.string('hashtag', 255).notNullable();
    table.integer('mentions').notNullable().defaultTo(0);
    table.decimal('sentiment', 3, 2).notNullable().defaultTo(0);
    table.date('date').notNullable();
    table.integer('project_id').unsigned().nullable();
    table.string('platform', 50).nullable();
    table.string('region', 50).nullable();
    table.json('metadata').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.index(['hashtag']);
    table.index(['date']);
    table.index(['project_id']);
    table.index(['platform']);
  });

  // Alerts table
  await knex.schema.createTable('alerts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.enum('type', ['trend', 'kpi', 'system', 'integration']).notNullable();
    table.string('target', 255).notNullable();
    table.decimal('threshold', 15, 2).nullable();
    table.enum('channel', ['email', 'sms', 'in_app', 'webhook']).notNullable().defaultTo('in_app');
    table.boolean('muted').notNullable().defaultTo(false);
    table.boolean('is_read').notNullable().defaultTo(false);
    table.string('message', 500).nullable();
    table.json('metadata').nullable();
    table.timestamp('triggered_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['user_id']);
    table.index(['type']);
    table.index(['is_read']);
  });

  // Integrations table
  await knex.schema.createTable('integrations', (table) => {
    table.increments('id').primary();
    table.integer('project_id').unsigned().nullable();
    table.string('provider', 100).notNullable();
    table.enum('status', ['connected', 'disconnected', 'error']).notNullable().defaultTo('disconnected');
    table.timestamp('last_sync').nullable();
    table.json('config').nullable();
    table.string('access_token', 500).nullable();
    table.string('refresh_token', 500).nullable();
    table.timestamp('token_expires_at').nullable();
    table.string('sync_schedule', 255).nullable(); // cron expression
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['project_id']);
    table.index(['provider']);
    table.index(['status']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('integrations');
  await knex.schema.dropTableIfExists('alerts');
  await knex.schema.dropTableIfExists('trends');
  await knex.schema.dropTableIfExists('kpis');
};


