import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/tasks';
import projectRoutes from './routes/projects';
import userRoutes from './routes/users';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
