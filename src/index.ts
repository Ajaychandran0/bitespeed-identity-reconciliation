import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from "dotenv";
import 'express-async-errors';
import appRouter from './routes/identify';
import errorHandler from './middlewares/error.middleware';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.send('Welcome to the Identity Reconciliation APIs');
});

app.use('/', appRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
