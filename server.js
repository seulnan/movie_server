require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const workRoutes = require('./routes/works');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// MongoDB 연결
connectDB();

// 라우트 설정
app.use('/api/works', workRoutes);

// 서버 시작
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
