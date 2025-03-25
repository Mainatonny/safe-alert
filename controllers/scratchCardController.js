const ScratchCard = require('../models/ScratchCard'); // Keep only one declaration
const User = require('../models/User');



const generateScratchCards = async (req, res) => {
  try {
    const userId = req.user.id;

    // Generate scratch card with a random reward (or 0 points)
    const rewardType = Math.random() < 0.5 ? "points" : "subscription"; // Example logic
    const rewardValue = rewardType === "points" ? Math.floor(Math.random() * 100) : 1; // Up to 100 points

    const scratchCard = new ScratchCard({
      userId , // Convert to ObjectId
      rewardType,
      rewardValue,
      isScratched: false,
    });

    await scratchCard.save();
    console.log("✅ Scratch card created for:", userId);
    return scratchCard;
  } catch (error) {
    console.error("❌ Error generating scratch card:", error);
  }
};

const redeemScratchCard = async (req, res) => {
  try {
    const { points } = req.body; // Accept points from frontend
    const userId = req.user.id;

    // Validate points
    if (typeof points !== 'number' || points < 10 || points > 100) {
      return res.status(400).json({ error: "Invalid points value (must be between 10-100)" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get today's date (reset at midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate total points earned today
    const totalPointsToday = user.pointsHistory
      .filter(entry => new Date(entry.date).getTime() === today.getTime())
      .reduce((sum, entry) => sum + entry.points, 0);

    if (totalPointsToday >= 100) {
      return res.status(400).json({ error: "Daily points limit reached (100 points)." });
    }

    // Check if adding the points would exceed the limit
    if (totalPointsToday + points > 100) {
      return res.status(400).json({
        error: `Cannot add ${points} points (would exceed daily limit). Remaining today: ${100 - totalPointsToday}`
      });
    }

    // Update user points
    user.points += points;
    user.pointsHistory.push({
      date: new Date(),
      points: points,
      source: 'spin_wheel'
    });
    await user.save();

    res.status(200).json({ 
      message: "Points redeemed successfully!", 
      points: points,
      dailyTotal: totalPointsToday + points,
      remainingDaily: 100 - (totalPointsToday + points)
    });

  } catch (error) {
    console.error("Redeem error:", error);
    res.status(500).json({ error: "Failed to redeem points." });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the total points
    res.status(200).json({ totalPoints: user.points });
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getUserScratchCards = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Fetching scratch cards for user: ${userId}`);

    const scratchCards = await ScratchCard.find({ userId });

    if (scratchCards.length === 0) {
      console.log("No scratch cards found.");
    } else {
      console.log("Scratch cards retrieved:", scratchCards);
    }

    res.json({ scratchCards });
  } catch (error) {
    console.error("Error fetching scratch cards:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  
  redeemScratchCard,
  getUserScratchCards,
  generateScratchCards ,
  getUserPoints,
};
