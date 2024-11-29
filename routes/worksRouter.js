const express = require('express');
const router = express.Router();
const worksController = require('../controllers/worksController');

// 북마크 필터링
router.get('/bookmarks', worksController.getBookmarked);

// 북마크 토글
router.patch('/:id/bookmark', worksController.toggleBookmark);

// 트렌딩 작품 조회
router.get('/trending', worksController.getTrendingWorks);

// Movie 카테고리 작품 조회
router.get('/movies', worksController.getMovies);

// Movie 카테고리 작품 조회
router.get('/TVseries', worksController.getTV);

// 모든 문서 반환 엔드포인트
router.get('/recommend', worksController.getRecommendWorks);

module.exports = router;
