const { LotteryProduct, LotteryStats } = require('../models/Lottery');

const getLotteryProducts = async (req, res) => {
  try {
    const products = await LotteryProduct.find({ userId: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching lottery products:', error);
    res.status(500).json({ error: 'Failed to fetch lottery products' });
  }
};

const getLotteryStatistics = async (req, res) => {
  try {
    const stats = await LotteryStats.findOne({ userId: req.user.id });
    if (!stats) {
      // Optionally create a default stats record
      const newStats = new LotteryStats({
        userId: req.user.id,
        totalTicketsSold: 0,
        totalWinners: 0,
        totalPrizesAwarded: 0,
      });
      await newStats.save();
      return res.status(200).json(newStats);
    }
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching lottery statistics:', error);
    res.status(500).json({ error: 'Failed to fetch lottery statistics' });
  }
};

module.exports = {
  getLotteryProducts,
  getLotteryStatistics,
};

