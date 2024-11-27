const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnailUrl: {
    regularLarge: { type: String, required: true }, // regular/large.jpg URL
    trendingLarge: { type: String }, // trending/large.jpg URL (선택적)
  },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: String, required: true },
  isBookmarked: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
});

module.exports = mongoose.model('Work', WorkSchema);
