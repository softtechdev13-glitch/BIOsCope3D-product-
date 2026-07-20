const { BodySystem, Organ, UserActivity } = require('../models');

// @desc    Get all body systems
// @route   GET /api/content/systems
// @access  Public
const getSystems = async (req, res) => {
  try {
    const systems = await BodySystem.findAll();
    res.json(systems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching systems' });
  }
};

// @desc    Get organs for a specific system
// @route   GET /api/content/systems/:id/organs
// @access  Public
const getSystemOrgans = async (req, res) => {
  try {
    const organs = await Organ.findAll({
      where: { system_id: req.params.id }
    });
    res.json(organs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching organs' });
  }
};

// @desc    Get recent learning progress
// @route   GET /api/content/recent
// @access  Private
const getRecentLearning = async (req, res) => {
  try {
    const recentActivities = await UserActivity.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Organ }],
      order: [['updated_at', 'DESC']],
      limit: 5,
    });
    
    // Map to the expected frontend format
    const formattedRecent = recentActivities.map(activity => ({
      id: activity.Organ.id,
      title: activity.Organ.name,
      subtitle: 'Exploration',
      progress: activity.progress || 0,
      imagePlaceholder: `${activity.Organ.name} 3D Model`,
    }));

    res.json(formattedRecent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching recent learning' });
  }
};

// @desc    Log organ view activity
// @route   POST /api/content/activity
// @access  Private
const logActivity = async (req, res) => {
  try {
    const { organ_id, progress } = req.body;
    
    let activity = await UserActivity.findOne({
      where: { user_id: req.user.id, organ_id }
    });

    if (activity) {
      activity.progress = progress !== undefined ? progress : activity.progress;
      activity.changed('updated_at', true);
      await activity.save();
    } else {
      activity = await UserActivity.create({
        user_id: req.user.id,
        organ_id,
        progress: progress || 0,
      });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error logging activity' });
  }
};

module.exports = {
  getSystems,
  getSystemOrgans,
  getRecentLearning,
  logActivity
};
