interface KnexOptions {
  dbType: string;
  pgUrl?: string;
  debug?: boolean;
  sqliteFile?: string;
}

export const bootstrapKnex = (options: KnexOptions) => {
  if (options.dbType === 'pg') {
    const { pgUrl, debug } = options;
    console.log('using pg');
    /* eslint-disable @typescript-eslint/no-var-requires */
    return require('knex')({
      client: 'pg',
      connection: pgUrl,
      debug,
      pool: { min: 2, max: 10 },
    });
  } else {
    console.log('using sqlite');
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
export const getKnex = () => {
  // Force SQLite - override any environment variables
  const dbType = 'sqlite';
  const sqliteFile = '/app/db.sqlite3';
  const debug = false;
  const pgUrl = undefined;
  
  console.log('getKnex config (FORCED TO SQLITE):', { dbType, sqliteFile });
  
  return bootstrapKnex({
    dbType,
    pgUrl,
    debug,
    sqliteFile,
  });
};
