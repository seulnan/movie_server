const Work = require('../models/work');

// 특정 카테고리와 북마크 상태를 기반으로 필터링
exports.getBookmarked = async (req, res) => {
  try {
    const works = await Work.find({ isBookmarked: true });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 북마크 상태 토글
exports.toggleBookmark = async (req, res) => {
  const { id } = req.params;
  try {
    const work = await Work.findById(id);
    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }
    work.isBookmarked = !work.isBookmarked;
    await work.save();
    res.json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 트렌딩 작품 필터링
exports.getTrendingWorks = async (req, res) => {
  try {
    const works = await Work.find({ isTrending: true });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 카테고리가 Movie인 작품 조회
exports.getMovies = async (req, res) => {
  try {
    const works = await Work.find({ category: 'Movie' });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 카테고리가 Movie인 작품 조회
exports.getTV = async (req, res) => {
  try {
    const works = await Work.find({ category: 'TV Series' });
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
