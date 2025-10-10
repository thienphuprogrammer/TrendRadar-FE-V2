/**
 * Migration: Create users and auth tables
 * Tables: users, sessions, user_preferences, audit_logs
 */

exports.up = async function (knex) {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('name', 255).notNullable();
    table.string('password_hash', 255).notNullable();
    table.enum('role', ['Admin', 'Owner', 'Analyst', 'Viewer']).notNullable().defaultTo('Viewer');
    table.enum('status', ['active', 'inactive', 'suspended']).notNullable().defaultTo('active');
    table.timestamp('last_login_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
  });

  // Sessions table
  await knex.schema.createTable('sessions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('token', 512).notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['token']);
    table.index(['user_id']);
    table.index(['expires_at']);
  });

  // User preferences table
  await knex.schema.createTable('user_preferences', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.string('language', 10).defaultTo('EN');
    table.string('timezone', 50).defaultTo('UTC');
    table.json('dashboard_layout').nullable();
    table.boolean('two_fa_enabled').notNullable().defaultTo(false);
    table.string('two_fa_secret', 255).nullable();
    table.json('notification_settings').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });

  // Audit logs table
  await knex.schema.createTable('audit_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable();
    table.string('action', 100).notNullable();
    table.string('resource', 100).notNullable();
    table.integer('resource_id').nullable();
    table.json('details').nullable();
    table.string('ip_address', 50).nullable();
    table.string('user_agent', 500).nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
    table.index(['user_id']);
    table.index(['action']);
    table.index(['resource']);
    table.index(['created_at']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('user_preferences');
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('users');
};


