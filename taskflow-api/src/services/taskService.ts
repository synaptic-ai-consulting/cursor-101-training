import { query } from '../db';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

export const getAllTasks = async (filters?: {
  status?: string;
  priority?: string;
  project_id?: string;
}): Promise<Task[]> => {
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params: unknown[] = [];
  let paramCount = 1;

  if (filters?.status) {
    sql += ` AND status = $${paramCount++}`;
    params.push(filters.status);
  }
  if (filters?.priority) {
    sql += ` AND priority = $${paramCount++}`;
    params.push(filters.priority);
  }
  if (filters?.project_id) {
    sql += ` AND project_id = $${paramCount++}`;
    params.push(filters.project_id);
  }

  sql += ' ORDER BY created_at DESC';
  const result = await query(sql, params);
  return result.rows;
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createTask = async (dto: CreateTaskDTO): Promise<Task> => {
  // BUG #1 (Session 4): Missing input validation — title can be empty string
  // This should validate that title is non-empty before inserting
  const result = await query(
    `INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      dto.title,
      dto.description || null,
      dto.status || 'todo',
      dto.priority || 'medium',
      dto.project_id || null,
      dto.assigned_to || null,
      dto.due_date || null,
    ]
  );
  return result.rows[0];
};

export const updateTask = async (id: string, dto: UpdateTaskDTO): Promise<Task | null> => {
  const fields: string[] = [];
  const params: unknown[] = [];
  let paramCount = 1;

  if (dto.title !== undefined) { fields.push(`title = $${paramCount++}`); params.push(dto.title); }
  if (dto.description !== undefined) { fields.push(`description = $${paramCount++}`); params.push(dto.description); }
  if (dto.status !== undefined) { fields.push(`status = $${paramCount++}`); params.push(dto.status); }
  if (dto.priority !== undefined) { fields.push(`priority = $${paramCount++}`); params.push(dto.priority); }
  if (dto.assigned_to !== undefined) { fields.push(`assigned_to = $${paramCount++}`); params.push(dto.assigned_to); }
  if (dto.due_date !== undefined) { fields.push(`due_date = $${paramCount++}`); params.push(dto.due_date); }

  if (fields.length === 0) return getTaskById(id);

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    params
  );
  return result.rows[0] || null;
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
