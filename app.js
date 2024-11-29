const express = require('express');
require('dotenv').config();

const worksRouter = require('./routes/worksRouter');
const uploadRoutes = require('./routes/upload');

const app = express();

const cors = require('cors');

// CORS 미들웨어 추가
app.use(
  cors({
    origin: 'http://localhost:3000', // 허용할 클라이언트 URL
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'], // 허용할 HTTP 메서드
    credentials: true, // 인증 정보(쿠키 등) 허용 여부
  })
);

app.options("*", cors()); // 모든 OPTIONS 요청에 CORS 허용
// 미들웨어 설정
app.use(express.json());

// 라우터 연결
app.use('/api/works', worksRouter); // /api/works 관련 라우트
app.use('/api/uploads', uploadRoutes); // /api/uploads 관련 라우트

module.exports = app;
