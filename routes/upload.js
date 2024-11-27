const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mongoose = require('mongoose');
const Work = require('../models/work'); // Work 스키마 가져오기

const router = express.Router();

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// multer-s3로 S3 업로드 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', // 퍼블릭 읽기 권한
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now().toString()}-${file.originalname}`;
      const folder = file.fieldname === 'regularLarge' ? 'regular' : 'trending'; // 필드명에 따라 폴더 분리
      cb(null, `${folder}/${fileName}`); // 경로 설정
    },
  }),
});

// 단일 이미지 업로드 엔드포인트
router.post(
  '/upload',
  upload.fields([
    { name: 'regularLarge', maxCount: 1 }, // regular/large.jpg
    { name: 'trendingLarge', maxCount: 1 }, // trending/large.jpg
  ]),
  async (req, res) => {
    try {
      // S3 URL 가져오기
      const regularLargeUrl = req.files['regularLarge'][0].location;
      const trendingLargeUrl = req.files['trendingLarge'][0].location;

      // MongoDB에 저장할 데이터
      const newWork = new Work({
        title: req.body.title,
        thumbnailUrl: {
          regularLarge: regularLargeUrl,
          trendingLarge: trendingLargeUrl,
        },
        year: req.body.year,
        category: req.body.category,
        rating: req.body.rating,
        isBookmarked: req.body.isBookmarked || false,
        isTrending: req.body.isTrending || false,
      });

      // MongoDB에 저장
      await newWork.save();

      res.status(201).json({
        message: 'Work created successfully!',
        work: newWork,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image or save work' });
    }
  }
);

module.exports = router;
