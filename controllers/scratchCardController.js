const ScratchCard = require('../models/ScratchCard'); // Keep only one declaration
const User = require('../models/User');

const getScratchCard = async (req, res) => {
  const { userId, activityType } = req.body; // userId and type of activity that triggered the reward

  // Define reward logic based on activity
  let rewardType = '';
  let rewardValue = 0;

  if (activityType === 'login') {
    rewardType = 'points';
    rewardValue = 10; // Give 10 points for logging in
  } else if (activityType === 'challenge') {
    rewardType = 'subscription';
    rewardValue = 1; // 1-month subscription extension
  } else if (activityType === 'campaign') {
    rewardType = 'goods';
    rewardValue = 1; // 1 item from the app’s goods list
  }

  try {
    const newScratchCard = new ScratchCard({
      userId,
      rewardType,
      rewardValue,
    });

    await newScratchCard.save();
    res.status(200).json({ message: 'Scratch card awarded!', scratchCard: newScratchCard });
  } catch (error) {
    res.status(500).json({ error: 'Error awarding scratch card.' });
  }
};

const redeemScratchCard = async (req, res) => {
  const { scratchCardId } = req.body;

  try {
    const scratchCard = await ScratchCard.findById(scratchCardId);

    if (!scratchCard) {
      return res.status(400).json({ error: 'Invalid scratch card.' });
    }

    // Prevent already scratched cards from being redeemed again
    if (scratchCard.isScratched) {
      return res.status(400).json({ error: 'Card already redeemed.' });
    }

    // Mark card as scratched
    scratchCard.isScratched = true;
    await scratchCard.save();

    // Update the user's account based on the reward type
    const user = await User.findById(scratchCard.userId);

    if (scratchCard.rewardType === 'points') {
      user.points += scratchCard.rewardValue; // Add points to the user's account
    } else if (scratchCard.rewardType === 'subscription') {
      user.subscriptionEndDate = new Date(new Date().setMonth(new Date().getMonth() + scratchCard.rewardValue)); // Add 1 month to subscription
    } else if (scratchCard.rewardType === 'goods') {
      user.goods.push('App Item'); // Add goods item to the user's account (can be customized)
    }

    await user.save();
    res.status(200).json({
      message: 'Scratch card redeemed successfully!',
      reward: scratchCard.rewardType,
      value: scratchCard.rewardValue,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error redeeming scratch card.' });
  }
};

module.exports = {
  getScratchCard,
  redeemScratchCard,
};
