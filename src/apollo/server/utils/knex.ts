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
  // Use environment variables with fallbacks to defaults
  const dbType = process.env.DB_TYPE || 'sqlite';
  const sqliteFile = process.env.SQLITE_FILE || './db.sqlite3';
  const debug = process.env.DEBUG === 'true';
  const pgUrl = process.env.PG_URL;
  
  console.log('getKnex config:', { dbType, sqliteFile, debug, pgUrl });
  
  return bootstrapKnex({
    dbType,
    pgUrl,
    debug,
    sqliteFile,
  });
};
