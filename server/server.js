import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { DATABASE } from './config.js';
import authRoutes from './routes/auth.js';
import adRoutes from './routes/ad.js';

const app = express();

//db
mongoose
	.connect(DATABASE)
	.then(() => {
		console.log('db connected');
	})
	.catch((err) => console.log(err));

//middlwares
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors());

//endpoint routes middleware
app.use('/api', authRoutes);
app.use('/api', adRoutes);

app.listen(8000, () => console.log('server running on port 8000'));
