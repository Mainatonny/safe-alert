const Partner = require('../models/Partner');
const User = require('../models/User');

const trackReferralDownload = async (referralCode, userId) => {
  try {
    // Find the partner associated with the referral code
    const partner = await Partner.findOne({ referralCode });

    if (partner) {
      // Update the partner's download count
      partner.downloads += 1;
      await partner.save();

      // Associate the user with the referring partner
      await User.findByIdAndUpdate(userId, { referredBy: partner._id });

      console.log('Referral download tracked successfully!');
    } else {
      console.log('Referral code not found.');
    }
  } catch (error) {
    console.error('Error tracking referral download:', error);
  }
};

const trackReferralRevenue = async (userId, amount) => {
    try {
      // Find the user to get their referring partner
      const user = await User.findById(userId).populate('referredBy');

      if (user && user.referredBy) {
        const partner = user.referredBy;

        // Update the partner's total revenue
        partner.totalRevenue += amount;
        await partner.save();

        console.log('Referral revenue tracked successfully!');
      } else {
        console.log('No referring partner found for this user.');
      }
    } catch (error) {
      console.error('Error tracking referral revenue:', error);
    }
};

module.exports = {
  trackReferralDownload,
  trackReferralRevenue
};

