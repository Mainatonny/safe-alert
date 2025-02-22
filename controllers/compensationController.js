const Compensation = require('../models/Compensation');
const User = require('../models/User');
// Get Compensation Details
const getCompensationDetails = async (req, res) => {
  try {
    let compensation = await Compensation.findOne({ userId: req.user.id });
    
    if (!compensation) {
      // Create a new compensation record with default values
      compensation = new Compensation({
        userId: req.user.id,
        policy: 'Default policy', // Or an empty string
        paidService: 'None'
      });
      await compensation.save();
    }
    
    res.status(200).json({ compensation });
  } catch (error) {
    console.error("Error retrieving compensation details:", error);
    res.status(500).json({
      message: "Error retrieving compensation details",
      error: error.message || error.toString()
    });
  }
};

// Update Compensation Details
const updateCompensationDetails = async (req, res) => {
  const { policy, paidService } = req.body;

  try {
    let compensation = await Compensation.findOne();
    if (!compensation) {
      compensation = new Compensation({ policy, paidService });
    } else {
      compensation.policy = policy;
      compensation.paidService = paidService;
    }

    await compensation.save();
    res.status(200).json({ message: 'Compensation details updated successfully.' });
  } catch (error) {
    console.error('Error updating compensation details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getCompensationDetails,
  updateCompensationDetails
};
