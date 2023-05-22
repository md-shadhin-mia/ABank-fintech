import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_postgresql_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_postgresql_password',
  port: 5432,
});

export default pool;
