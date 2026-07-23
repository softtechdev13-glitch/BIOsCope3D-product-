const { Bookmark, BodySystem, Organ } = require('../models');

exports.addBookmark = async (req, res) => {
  try {
    const { item_type, item_id, title } = req.body;
    const user_id = req.user.id;

    if (!item_type || !item_id) {
      return res.status(400).json({ message: 'item_type and item_id are required' });
    }

    const strItemId = String(item_id);

    // Check if it already exists
    const existing = await Bookmark.findOne({
      where: { user_id, item_type, item_id: strItemId }
    });

    if (existing) {
      if (title && existing.title !== title) {
        existing.title = title;
        await existing.save();
      }
      return res.status(200).json(existing);
    }

    const bookmark = await Bookmark.create({
      user_id,
      item_type,
      item_id: strItemId,
      title: title || `${item_type} ${strItemId}`
    });

    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const { item_type, item_id } = req.params;
    const user_id = req.user.id;

    const strItemId = String(item_id);

    await Bookmark.destroy({
      where: { user_id, item_type, item_id: strItemId }
    });

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
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
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
