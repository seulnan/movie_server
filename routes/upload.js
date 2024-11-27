const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Work = require('../models/work'); // Work 스키마 가져오기

const router = express.Router();

// AWS S3 클라이언트 생성
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// multer 설정
const storage = multer.memoryStorage(); // 메모리에 파일 저장
const upload = multer({ storage });

// 파일 업로드 함수
const uploadToS3 = async (file, folder) => {
  const fileName = `${Date.now().toString()}-${file.originalname}`;
  const key = `${folder}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // 퍼블릭 읽기 권한
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error('S3 Upload Error:', err);
    throw new Error('Failed to upload file to S3');
  }
};

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
      const regularLargeUrl = await uploadToS3(
        req.files['regularLarge'][0],
        'regular'
      );
      const trendingLargeUrl = await uploadToS3(
        req.files['trendingLarge'][0],
        'trending'
      );

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
