const Reward = require('../models/Reward');
const User = require('../models/User');

exports.getPendingRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ status: 'pending' })
      .populate('userId', 'name email');
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending rewards' });
  }
};

exports.approveReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    const user = await User.findById(reward.userId);
    user.walletBalance += reward.amount;

    reward.status = 'approved';
    await Promise.all([user.save(), reward.save()]);

    res.status(200).json({ message: 'Reward approved and funds added' });
  } catch (error) {
    res.status(500).json({ error: 'Reward approval failed' });
  }
};

exports.rejectReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    reward.status = 'rejected';
    await reward.save();

    res.status(200).json({ message: 'Reward rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject reward' });
  }
};

exports.getUserRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.userId });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user rewards' });
  }
};

exports.submitReward = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const reward = new Reward({
      userId: req.userId,
      amount,
      description,
      status: 'pending',
    });

    await reward.save();
    res.status(201).json({ message: 'Reward submitted for approval', reward });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit reward' });
  }
};
