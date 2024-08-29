import express from 'express';
import { PrismaClient } from '@prisma/client';
import identityRoutes from './routes/identityRoutes';
import errorHandler from './utils/errorhandler';

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());

app.use('/api', identityRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
