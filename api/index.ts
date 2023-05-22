import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
app.use(bodyParser.json());

// Database configuration
const pool = new Pool({
  user: 'your_postgresql_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_postgresql_password',
  port: 5432,
});

// Create account
app.post('/accounts', async (req, res) => {
  const { accountNumber, balance } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO accounts (account_number, balance) VALUES ($1, $2) RETURNING id',
      [accountNumber, balance]
    );
    const newAccountId = result.rows[0].id;
    client.release();
    res.json({ id: newAccountId });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the account.' });
  }
});

// Find account
app.get('/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM accounts WHERE id = $1',
      [id]
    );
    client.release();

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Account not found.' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the account.' });
  }
});

// Deposit funds
app.post('/accounts/:id/deposit', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    const result = await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING balance',
      [amount, id]
    );
    const newBalance = result.rows[0].balance;
    await client.query(
      'INSERT INTO transactions (account_id, amount, type) VALUES ($1, $2, $3)',
      [id, amount, 'deposit']
    );
    await client.query('COMMIT');
    client.release();
    res.json({ balance: newBalance });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while depositing funds.' });
  }
});

// Withdraw funds
app.post('/accounts/:id/withdraw', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    const result = await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance',
      [amount, id]
    );
    const newBalance = result.rows[0].balance;
    await client.query(
      'INSERT INTO transactions (account_id, amount, type) VALUES ($1, $2, $3)',
      [id, amount, 'withdraw']
    );
    await client.query('COMMIT');
    client.release();
    res.json({ balance: newBalance });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while withdrawing funds.' });
  }
});

// Check balance
app.get('/accounts/:id/balance', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT balance FROM accounts WHERE id = $1',
      [id]
    );
    client.release();

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Account not found.' });
    } else {
      res.json({ balance: result.rows[0].balance });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the balance.' });
  }
});

// Check transaction history
app.get('/accounts/:id/history', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM transactions WHERE account_id = $1',
      [id]
    );
    client.release();

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Account not found or no transactions found.' });
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the transaction history.' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
