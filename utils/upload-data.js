require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');
const Work = require('../models/work'); // Work 스키마 가져오기


console.log('MongoDB URI:', process.env.MONGO_URI);

// AWS S3 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// AWS S3에 파일 업로드
const uploadToS3 = async (filePath, key) => {
  if (!fs.existsSync(filePath)) return null; // 파일이 없으면 null 반환
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg',
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// 데이터 처리 및 업로드
const processAndUploadData = async () => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

  for (const item of data) {
    try {
      const folderName = item.title
        .toLowerCase()
        .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
        .replace(/[^a-z0-9-]/g, ''); // 알파벳, 숫자, 하이픈 외의 문자를 제거
      console.log(`Processing: ${item.title} -> Folder: ${folderName}`);

      // Regular 이미지 업로드
      const regularLargePath = path.resolve(
        __dirname,
        `./thumbnails/${folderName}/regular/large.jpg`
      );
      console.log('Regular Image Path:', regularLargePath);


      if (!fs.existsSync(regularLargePath)) {
        console.error(`File does not exist: ${regularLargePath}`);
        continue; // 다음 데이터로 넘어감
      }

      const regularLargeKey = `thumbnails/${folderName}/regular-large.jpg`;
      const regularLargeUrl = await uploadToS3(
        regularLargePath,
        regularLargeKey
      );

      if (!regularLargeUrl) {
        console.error(`Failed to upload regular image for ${item.title}`);
        continue; // 다음 데이터로 넘어감
      }

      // Trending 이미지 업로드 (trending 폴더가 없는 경우 스킵)
      let trendingLargeUrl = null;
      const trendingLargePath = path.resolve(
        __dirname,
        `./thumbnails/${folderName}/trending/large.jpg`
      );
      if (fs.existsSync(trendingLargePath)) {
        const trendingLargeKey = `thumbnails/${folderName}/trending-large.jpg`;
        trendingLargeUrl = await uploadToS3(
          trendingLargePath,
          trendingLargeKey
        );
      }

          // MongoDB에 저장
      if (regularLargeUrl) {
        try {
          const newWork = new Work({
            title: item.title,
            thumbnailUrl: {
              regularLarge: regularLargeUrl,
              trendingLarge: trendingLargeUrl || null, // 없는 경우 null 저장
            },
            year: item.year,
            category: item.category,
            rating: item.rating,
            isBookmarked: item.isBookmarked || false,
            isTrending: item.isTrending || false,
          });

          await newWork.save(); // MongoDB에 저장
          console.log(`Uploaded and saved: ${item.title}`);
        } catch (saveError) {
          console.error(`Failed to save to MongoDB for ${item.title}:`, saveError.message);
        }
      }
    } catch (error) {
      console.error(`Failed to process ${item.title}:`, error.message);
    }
  }

  console.log('All data processed.');
  mongoose.disconnect();
};

processAndUploadData();
