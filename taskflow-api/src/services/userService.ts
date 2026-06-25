import { query } from '../db';
import bcrypt from 'bcryptjs';
import { User } from '../types';

export const getAllUsers = async (): Promise<Omit<User, 'password_hash'>[]> => {
  const result = await query('SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC');
  return result.rows;
};

export const getUserById = async (id: string): Promise<Omit<User, 'password_hash'> | null> => {
  const result = await query(
    'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const createUser = async (name: string, email: string, password: string): Promise<Omit<User, 'password_hash'>> => {
  // BUG #3 (Session 4): email format is not validated before inserting
  // Should validate email regex before hitting the DB
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('Email already in use');
  }
  const password_hash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at, updated_at`,
    [name, email, password_hash]
  );
  return result.rows[0];
};
