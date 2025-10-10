/**
 * Migration: Create content and reports tables
 * Tables: content_calendar, reports, report_schedules, uploaded_files
 */

exports.up = async function (knex) {
  // Content calendar table
  await knex.schema.createTable('content_calendar', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.text('content').notNullable();
    table.timestamp('scheduled_at').notNullable();
    table.string('platform', 50).notNullable();
    table.enum('status', ['draft', 'scheduled', 'published', 'failed']).notNullable().defaultTo('draft');
    table.string('tone', 50).nullable();
    table.json('metadata').nullable();
    table.timestamp('published_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['user_id']);
    table.index(['scheduled_at']);
    table.index(['platform']);
    table.index(['status']);
  });

  // Reports table
  await knex.schema.createTable('reports', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('name', 255).notNullable();
    table.enum('type', ['weekly_summary', 'monthly_trends', 'custom']).notNullable();
    table.json('config').nullable();
    table.string('file_path', 500).nullable();
    table.enum('format', ['pdf', 'pptx', 'csv', 'email']).notNullable().defaultTo('pdf');
    table.timestamp('generated_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['user_id']);
    table.index(['type']);
  });

  // Report schedules table
  await knex.schema.createTable('report_schedules', (table) => {
    table.increments('id').primary();
    table.integer('report_id').unsigned().notNullable();
    table.string('cron_expression', 100).notNullable();
    table.json('recipients').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('next_run_at').nullable();
    table.timestamp('last_run_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('report_id').references('reports.id').onDelete('CASCADE');
    table.index(['report_id']);
    table.index(['is_active']);
    table.index(['next_run_at']);
  });

  // Uploaded files table
  await knex.schema.createTable('uploaded_files', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('filename', 255).notNullable();
    table.string('path', 500).notNullable();
    table.integer('size').notNullable(); // in bytes
    table.string('mime_type', 100).notNullable();
    table.json('schema_preview').nullable();
    table.json('chart_suggestions').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['user_id']);
    table.index(['created_at']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('uploaded_files');
  await knex.schema.dropTableIfExists('report_schedules');
  await knex.schema.dropTableIfExists('reports');
  await knex.schema.dropTableIfExists('content_calendar');
};


