const express = require('express');
require('dotenv').config();

const worksRouter = require('./routes/worksRouter');
const uploadRoutes = require('./routes/upload');

const app = express();

// 미들웨어 설정
app.use(express.json());

// 라우터 연결
app.use('/api/works', worksRouter); // /api/works 관련 라우트
app.use('/api/uploads', uploadRoutes); // /api/uploads 관련 라우트

module.exports = app;
