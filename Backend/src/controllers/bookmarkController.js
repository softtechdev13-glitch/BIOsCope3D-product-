const { Bookmark, BodySystem, Organ } = require('../models');

exports.addBookmark = async (req, res) => {
  try {
    const { item_type, item_id, title } = req.body;
    const user_id = req.user.id;

    // Check if it already exists
    const existing = await Bookmark.findOne({
      where: { user_id, item_type, item_id }
    });

    if (existing) {
      return res.status(400).json({ message: 'Bookmark already exists' });
    }

    const bookmark = await Bookmark.create({
      user_id,
      item_type,
      item_id,
      title
    });

    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const { item_type, item_id } = req.params;
    const user_id = req.user.id;

    const deleted = await Bookmark.destroy({
      where: { user_id, item_type, item_id }
    });

    if (deleted) {
      res.json({ message: 'Bookmark removed successfully' });
    } else {
      res.status(404).json({ message: 'Bookmark not found' });
    }
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookmarks = await Bookmark.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']]
    });

    res.json(bookmarks);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
