interface KnexOptions {
  dbType: string;
  pgUrl?: string;
  debug?: boolean;
  sqliteFile?: string;
}

export const bootstrapKnex = (options: KnexOptions) => {
  console.log('bootstrapKnex called with options:', JSON.stringify(options));
  
  if (options.dbType === 'pg') {
    const { pgUrl, debug } = options;
    console.log('ERROR: TRYING TO USE PG - THIS SHOULD NOT HAPPEN');
    console.log('using pg');
    /* eslint-disable @typescript-eslint/no-var-requires */
    return require('knex')({
      client: 'pg',
      connection: pgUrl,
      debug,
      pool: { min: 2, max: 10 },
    });
  } else {
    console.log('✅ CORRECTLY using sqlite at:', options.sqliteFile);
    /* eslint-disable @typescript-eslint/no-var-requires */
    return require('knex')({
      client: 'better-sqlite3',
      connection: {
        filename: options.sqliteFile,
      },
      useNullAsDefault: true,
    });
  }
};

// Get knex instance using server config
// Singleton knex instance to ensure consistency
let knexInstance: any = null;

export const getKnex = () => {
  if (knexInstance) {
    return knexInstance;
  }
  
  // ABSOLUTELY FORCE SQLite - ignore ALL environment variables
  const dbType = 'sqlite';
  const sqliteFile = '/app/db.sqlite3';
  const debug = false;
  const pgUrl = undefined;
  
  console.log('🔧 getKnex: FORCING SQLITE (singleton init):', { dbType, sqliteFile });
  
  knexInstance = bootstrapKnex({
    dbType,
    pgUrl,
    debug,
    sqliteFile,
  });
  
  return knexInstance;
};
