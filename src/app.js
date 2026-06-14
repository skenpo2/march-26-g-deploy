import express from 'express';
import cors from 'cors';
import V1routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the March Cohort API deployment');
});
app.use('/api/v1', V1routes);

app.use(errorHandler);

export default app;
