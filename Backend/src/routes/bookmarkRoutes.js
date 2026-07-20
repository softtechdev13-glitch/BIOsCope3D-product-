const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, getUserBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addBookmark);
router.get('/', protect, getUserBookmarks);
router.delete('/:item_type/:item_id', protect, removeBookmark);

module.exports = router;
