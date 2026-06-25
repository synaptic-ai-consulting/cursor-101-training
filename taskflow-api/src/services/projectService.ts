import { query } from '../db';
import { Project, CreateProjectDTO } from '../types';

export const getAllProjects = async (): Promise<Project[]> => {
  const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
  return result.rows;
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createProject = async (dto: CreateProjectDTO): Promise<Project> => {
  // BUG #2 (Session 4): owner_id is not validated to exist in the users table
  // A non-existent owner_id should return a 400 error, not a DB constraint error
  const result = await query(
    `INSERT INTO projects (name, description, owner_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [dto.name, dto.description || null, dto.owner_id]
  );
  return result.rows[0];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM projects WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
