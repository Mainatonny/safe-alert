const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Assuming you have a Transaction model

const withdrawRevenue = async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check if user has enough revenue to withdraw
    if (user.revenue >= amount) {
      // Deduct the withdrawn amount
      user.revenue -= amount;
      await user.save();

      // Log the transaction
      const transaction = new Transaction({
        userId: user._id,
        amount,
        type: 'withdrawal',
        date: new Date(),
      });
      await transaction.save();

      // Simulate payment processing (replace with actual gateway logic)
      const success = await mockPaymentProcessing(user, amount);
      if (success) {
        res.status(200).json({ message: 'Withdrawal successful.' });
      } else {
        res.status(500).json({ error: 'Payment processing failed.' });
      }
    } else {
      res.status(400).json({ message: 'Insufficient revenue to withdraw.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error processing withdrawal.' });
  }
};

// Mock function for payment processing (replace with actual logic)
const mockPaymentProcessing = (user, amount) => {
  console.log(`Processing withdrawal of ${amount} for user ${user.name}`);
  return true; // Simulate successful payment
};

module.exports = {
  withdrawRevenue
};
