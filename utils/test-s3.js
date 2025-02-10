require('dotenv').config(); // .env 파일 로드
const AWS = require('aws-sdk');

// AWS 자격증명 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // .env에서 가져오기
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME; // .env에서 버킷 이름 가져오기

// 1. S3 버킷 목록 불러오기
const listBuckets = async () => {
  try {
    const response = await s3.listBuckets().promise();
    console.log('S3 Buckets:', response.Buckets);
  } catch (error) {
    console.error('Error listing buckets:', error.message);
  }
};

// 2. S3 버킷에 파일 업로드 테스트
const uploadFile = async () => {
  try {
    const params = {
      Bucket: bucketName,
      Key: 'test-folder/test-file.txt', // S3에 저장할 파일 경로
      Body: 'Hello, this is a test file!', // 파일 내용
    };

    const response = await s3.upload(params).promise();
    console.log('File uploaded successfully:', response.Location);
  } catch (error) {
    console.error('Error uploading file:', error.message);
  }
};

// 실행
(async () => {
  await listBuckets();
  await uploadFile();
})();
