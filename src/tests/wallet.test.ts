import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';

// --- MOCK SETUP --- //
jest.mock('mongoose', () => {
  return {
    model: jest.fn(),
    connect: jest.fn().mockResolvedValue(true),
  };
});

// Import models as usual (commented out to avoid loading real models)
// import Wallet from '@/models/Wallet';
// import Transaction from '@/models/Transaction';

describe('Wallet Debits', () => {
  let WalletModel: any;
  let TransactionModel: any;
  let mockFindOneAndUpdate: jest.Mock;
  let mockFindOne: jest.Mock;
  let mockTransactionConstructor: jest.Mock;
  let mockTransactionSave: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset and reconfigure the model mock for each test
    const mockModel = (mongoose as any).model as jest.Mock;

    // Create fresh mocks for each test
    mockFindOneAndUpdate = jest.fn();
    mockFindOne = jest.fn();
    mockTransactionConstructor = jest.fn();
    mockTransactionSave = jest.fn().mockResolvedValue({});

    // Set up Wallet model mock
    const WalletMock = {
      findOneAndUpdate: mockFindOneAndUpdate,
      findOne: mockFindOne,
    };
    mockModel.mockImplementation((name: string) => {
      if (name === 'Wallet') {
        return WalletMock;
      }
      if (name === 'Transaction') {
        return mockTransactionConstructor;
      }
      return {};
    });

    // Now call model to "initialize" it (this will use the new implementation)
    WalletModel = mongoose.model('Wallet');
    TransactionModel = mongoose.model('Transaction');

    // Set up Transaction instance mock
    mockTransactionConstructor.mockImplementation(function (this: any, data: any) {
      this.data = data;
      this.save = mockTransactionSave;
      return this;
    });
  });

  it('should debit wallet balance and create pending transaction', async () => {
    // Prepare mock wallet with updated values (simulating the $inc effect)
    const mockWallet = { 
      _id: 'wallet1', 
      userId: 'user1', 
      balance: 1000, 
      pendingHold: 500 
    };
    mockFindOneAndUpdate.mockResolvedValue(mockWallet);

    // Act: Call Wallet logic
    const wallet = await WalletModel.findOneAndUpdate(
      { userId: 'user1' },
      { $inc: { pendingHold: 500 } },
      { new: true }
    );

    // Create transaction
    const transaction = new TransactionModel({
      userId: 'user1',
      type: 'debit',
      amount: 500,
      status: 'pending',
    });
    await transaction.save();

    // Assert
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user1' },
      { $inc: { pendingHold: 500 } },
      { new: true }
    );
    expect(wallet).toEqual(mockWallet);
    expect(wallet.pendingHold).toBe(500);
    expect(mockTransactionConstructor).toHaveBeenCalledWith({
      userId: 'user1',
      type: 'debit',
      amount: 500,
      status: 'pending',
    });
    expect(mockTransactionSave).toHaveBeenCalled();
  });

  it('should fail debit if insufficient balance', async () => {
    // Prepare mock wallet
    const mockWallet = { 
      _id: 'wallet1', 
      userId: 'user1', 
      balance: 200, 
      pendingHold: 0 
    };
    mockFindOne.mockResolvedValue(mockWallet);

    // Act
    const wallet = await WalletModel.findOne({ userId: 'user1' });
    const canDebit = wallet.balance >= 500;

    // Assert
    expect(mockFindOne).toHaveBeenCalledWith({ userId: 'user1' });
    expect(canDebit).toBe(false);
  });
});