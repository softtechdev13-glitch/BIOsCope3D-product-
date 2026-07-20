const { User, UserProgress, UserActivity, Organ, BodySystem } = require('../models');

// @desc    Get user profile and stats
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (user) {
      // Get count of completed quizzes for certificates metric
      const certificatesCount = await UserProgress.count({
        where: { user_id: req.user.id }
      });

      res.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        is_premium: user.is_premium,
        study_time_minutes: user.study_time_minutes,
        profile_image: user.profile_image ? `/uploads/profiles/${user.profile_image}` : null,
        certificates: certificatesCount,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// @desc    Update user study time
// @route   POST /api/users/study-time
// @access  Private
const updateStudyTime = async (req, res) => {
  try {
    const { minutes } = req.body;
    
    if (!minutes || typeof minutes !== 'number' || minutes <= 0) {
      return res.status(400).json({ message: 'Valid minutes required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.study_time_minutes += minutes;
    await user.save();

    res.json({ 
      message: 'Study time updated',
      study_time_minutes: user.study_time_minutes 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating study time' });
  }
};

// @desc    Upload user profile image
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile_image = req.file.filename;
    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      profile_image: `/uploads/profiles/${user.profile_image}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error uploading image' });
  }
};

// @desc    Get user's last activity
// @route   GET /api/users/last-activity
// @access  Private
const getLastActivity = async (req, res) => {
  try {
    const lastActivity = await UserActivity.findOne({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']],
      include: [
        { 
          model: Organ,
          include: [{ model: BodySystem, attributes: ['name', 'thumbnail_url'] }] 
        }
      ]
    });

    if (lastActivity) {
      res.json({
        id: lastActivity.id,
        progress: lastActivity.progress,
        organ_name: lastActivity.Organ?.name,
        system_name: lastActivity.Organ?.BodySystem?.name,
        thumbnail_url: lastActivity.Organ?.BodySystem?.thumbnail_url || lastActivity.Organ?.model_url,
        updated_at: lastActivity.updated_at
      });
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching last activity' });
  }
};

module.exports = {
  getUserProfile,
  updateStudyTime,
  uploadProfileImage,
  getLastActivity,
};
