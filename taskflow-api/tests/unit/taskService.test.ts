// Unit tests for taskService
// NOTE: These tests mock the DB — no real DB connection needed

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

import * as db from '../../src/db';
import * as taskService from '../../src/services/taskService';

const mockQuery = db.query as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('taskService.getAllTasks', () => {
  it('returns all tasks when no filters provided', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'todo', priority: 'medium' },
      { id: '2', title: 'Task 2', status: 'done', priority: 'high' },
    ];
    mockQuery.mockResolvedValue({ rows: mockTasks, rowCount: 2 });

    const result = await taskService.getAllTasks();
    expect(result).toEqual(mockTasks);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('filters by status when provided', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    await taskService.getAllTasks({ status: 'todo' });
    const callArgs = mockQuery.mock.calls[0];
    expect(callArgs[0]).toContain('status');
    expect(callArgs[1]).toContain('todo');
  });
});

describe('taskService.getTaskById', () => {
  it('returns task when found', async () => {
    const mockTask = { id: 'abc', title: 'Test Task', status: 'todo', priority: 'low' };
    mockQuery.mockResolvedValue({ rows: [mockTask], rowCount: 1 });
    const result = await taskService.getTaskById('abc');
    expect(result).toEqual(mockTask);
  });

  it('returns null when task not found', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const result = await taskService.getTaskById('nonexistent');
    expect(result).toBeNull();
  });
});

describe('taskService.createTask', () => {
  it('creates a task with default status and priority', async () => {
    const mockTask = { id: 'new-id', title: 'New Task', status: 'todo', priority: 'medium' };
    mockQuery.mockResolvedValue({ rows: [mockTask], rowCount: 1 });

    const result = await taskService.createTask({ title: 'New Task' });
    expect(result).toEqual(mockTask);
  });

  // TODO (Session 1 Lab): Add test — should reject empty title
  // TODO (Session 2 Lab - TDD): Add test — should reject title longer than 255 chars
  // TODO (Session 2 Lab - TDD): Add test — should reject invalid status value
});

describe('taskService.deleteTask', () => {
  it('returns true when task deleted', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 1 });
    const result = await taskService.deleteTask('some-id');
    expect(result).toBe(true);
  });

  it('returns false when task not found', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const result = await taskService.deleteTask('nonexistent');
    expect(result).toBe(false);
  });
});
