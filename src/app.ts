import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import authRoutes from './routes/auth.routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/auth', authRoutes);

mongoose
  .connect('mongodb://localhost:27017/mydatabase',
   {useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Database connection failed');
    console.error(error);
  });