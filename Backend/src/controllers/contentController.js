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

// @desc    Get organ by ID or Name
// @route   GET /api/content/organs/:id
// @access  Public
const getOrganById = async (req, res) => {
  try {
    const idOrName = req.params.id;
    let organ = null;

    // 1. Try finding by PK if it looks like UUID
    if (idOrName && idOrName.includes('-')) {
      try {
        organ = await Organ.findByPk(idOrName, {
          include: [{ model: BodySystem }]
        });
      } catch (e) {}
    }

    // 2. Try finding by Name
    if (!organ && idOrName) {
      organ = await Organ.findOne({
        where: { name: idOrName },
        include: [{ model: BodySystem }]
      });
    }

    // 3. Try finding by System if systemId or system name passed
    if (!organ && idOrName) {
      let system = null;
      if (idOrName.includes('-')) {
        try {
          system = await BodySystem.findByPk(idOrName, { include: [{ model: Organ }] });
        } catch (e) {}
      }
      if (!system) {
        system = await BodySystem.findOne({ where: { name: idOrName }, include: [{ model: Organ }] });
      }
      if (system && system.Organs && system.Organs.length > 0) {
        organ = system.Organs[0];
      }
    }

    // 4. Fallback: get any organ from database
    if (!organ) {
      organ = await Organ.findOne({ include: [{ model: BodySystem }] });
    }

    if (organ) {
      return res.json(organ);
    }

    // 5. Default rich fallback object
    return res.json({
      id: idOrName || '1',
      name: idOrName || 'Anatomical Structure',
      key_facts: `Anatomy and structural breakdown of ${idOrName || 'this organ'}. It plays a vital role in bodily function.`,
      functions: `Primary biological functions include regulation, protection, and physiological support for ${idOrName || 'this system'}.`,
      clinical_diseases: `Pathologies related to ${idOrName || 'this organ'} include inflammatory conditions, structural disorders, and functional impairment.`,
      BodySystem: { name: 'Anatomy' }
    });
  } catch (error) {
    console.error('Error fetching organ by ID:', error);
    res.status(500).json({ message: 'Server error fetching organ' });
  }
};

module.exports = {
  getSystems,
  getSystemOrgans,
  getOrganById,
  getRecentLearning,
  logActivity
};
