import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // ← this line is critical
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
