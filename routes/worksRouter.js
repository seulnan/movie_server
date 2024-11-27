const express = require('express');
const router = express.Router();
const worksController = require('../controllers/worksController');

// 북마크 필터링
router.get('/bookmarks/:category', worksController.getBookmarkedByCategory);

// 북마크 토글
router.patch('/:id/bookmark', worksController.toggleBookmark);

// 트렌딩 작품 조회
router.get('/trending', worksController.getTrendingWorks);

// Movie 카테고리 작품 조회
router.get('/movies', worksController.getMovies);

// Movie 카테고리 작품 조회
router.get('/TVseries', worksController.getTV);

module.exports = router;
