import express from 'express';
import cors from 'cors';
import errandsRouter from './routes/errands.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/errands', errandsRouter);

app.listen(3000, () => {
  console.log('ERS API running on port 3000');
});
