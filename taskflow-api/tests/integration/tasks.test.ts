// Integration tests for /tasks routes
// Uses supertest — requires a real or in-memory DB for full integration
// For the training course, these are run with mocked DB layer

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import request from 'supertest';
import app from '../../src/app';
import * as db from '../../src/db';

const mockQuery = db.query as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /tasks', () => {
  it('returns 200 with task list', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: '1', title: 'Test' }], rowCount: 1 });
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /tasks/:id', () => {
  it('returns 200 when task exists', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 'abc', title: 'Found' }], rowCount: 1 });
    const res = await request(app).get('/tasks/abc');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('abc');
  });

  it('returns 404 when task not found', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const res = await request(app).get('/tasks/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /tasks', () => {
  it('returns 201 when task created with valid data', async () => {
    const newTask = { id: 'new', title: 'New Task', status: 'todo', priority: 'medium' };
    mockQuery.mockResolvedValue({ rows: [newTask], rowCount: 1 });
    const res = await request(app).post('/tasks').send({ title: 'New Task' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // TODO (Session 1 Lab): Add test — POST /tasks with empty title should return 400
  // TODO (Session 1 Lab): Add test — POST /tasks with invalid status should return 400
  // TODO (Session 2 Lab - TDD): Add test — POST /tasks with invalid priority should return 400
});

describe('DELETE /tasks/:id', () => {
  it('returns 204 when task deleted', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 1 });
    const res = await request(app).delete('/tasks/abc');
    expect(res.status).toBe(204);
  });

  it('returns 404 when task not found', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const res = await request(app).delete('/tasks/nonexistent');
    expect(res.status).toBe(404);
  });
});
