const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// 미들웨어
app.use(express.json());
app.use('/api/uploads', uploadRoutes);

// 서버 실행
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
