const cron = require('node-cron');
const mongoose = require('mongoose');
const dbConnect = require('../lib/db').default; // Adjust path if needed
const Cart = require('../models/Cart').default;
const Wallet = require('../models/Wallet').default;
const Transaction = require('../models/Transaction').default;

// Connect to DB
dbConnect();

// Job 1: Cleanup abandoned carts every hour (delete expired, release holds if any)
cron.schedule('0 * * * *', async () => {
  console.log('Running abandoned cart cleanup...');
  const expiredCarts = await Cart.find({ expiresAt: { $lt: new Date() } });
  for (const cart of expiredCarts) {
    // Release any associated hold (if order not created)
    const wallet = await Wallet.findOne({ userId: cart.userId });
    if (wallet && wallet.pendingHold >= cart.totalAmount) {
      wallet.pendingHold -= cart.totalAmount;
      await wallet.save();

      // Log reversal transaction
      const reversal = new (mongoose.model('Transaction'))({
        userId: cart.userId,
        type: 'credit', // Reversal
        method: 'Abandoned Cart Release',
        reference: `REV_${cart._id}`,
        amount: cart.totalAmount,
        currency: cart.currency,
        status: 'success',
      });
      await reversal.save();
    }
    await Cart.deleteOne({ _id: cart._id });
  }
  console.log(`Cleaned ${expiredCarts.length} carts.`);
});

// Job 2: Reconcile holds daily (release old pending holds >24h)
cron.schedule('0 0 * * *', async () => {
  console.log('Running hold reconciliation...');
  const oldTransactions = await Transaction.find({
    status: 'pending',
    type: 'debit',
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  for (const trans of oldTransactions) {
    const wallet = await Wallet.findOne({ userId: trans.userId });
    if (wallet && wallet.pendingHold >= trans.amount) {
      wallet.pendingHold -= trans.amount;
      await wallet.save();
      trans.status = 'reconciled'; // Or 'reversed'
      await trans.save();
    }
  }
  console.log(`Reconciled ${oldTransactions.length} holds.`);
});

console.log('Cron jobs scheduled. Press Ctrl+C to stop.');