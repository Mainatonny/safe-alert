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
    const { scratchCardId } = req.body;
    const userId = req.user.id;

    // Find scratch card
    const scratchCard = await ScratchCard.findById(scratchCardId);
    if (!scratchCard) {
      return res.status(404).json({ error: "Scratch card not found." });
    }
    if (scratchCard.isScratched) {
      return res.status(400).json({ error: "Scratch card already used." });
    }

    // Check user's daily points
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

    // Generate random points between 10 and 100
    const earnedPoints = Math.min(100 - totalPointsToday, Math.floor(Math.random() * 91) + 10);

    // Update user points
    user.points += earnedPoints;
    user.pointsHistory.push({ date: new Date(), points: earnedPoints });
    await user.save();

    // Mark scratch card as scratched
    scratchCard.isScratched = true;
    await scratchCard.save();

    res.status(200).json({ message: "Scratch card redeemed!", points: earnedPoints });
  } catch (error) {
    console.error("Redeem error:", error);
    res.status(500).json({ error: "Failed to redeem scratch card." });
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
};
