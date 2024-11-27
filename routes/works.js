const express = require('express');
const Work = require('../models/work');
const router = express.Router();

// 1. 특정 카테고리와 북마크 상태를 기반으로 필터링
router.get('/bookmarks/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const works = await Work.find({ category, isBookmarked: true });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. 북마크 상태 토글
router.patch('/:id/bookmark', async (req, res) => {
  const { id } = req.params;
  try {
    const work = await Work.findById(id);
    work.isBookmarked = !work.isBookmarked;
    await work.save();
    res.json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. 트렌딩 작품 필터링
router.get('/trending', async (req, res) => {
  try {
    const works = await Work.find({ isTrending: true });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. 카테고리가 Movie인 작품 조회
router.get('/movies', async (req, res) => {
  try {
    const works = await Work.find({ category: 'Movie' });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
