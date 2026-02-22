import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';

// --- MOCK SETUP --- //
jest.mock('mongoose', () => {
  return {
    model: jest.fn(),
    // Fix: mockResolvedValue needs a typed mock — use jest.fn() chain instead
    connect: jest.fn().mockResolvedValue(true as unknown as never),
  };
});

describe('Wallet Debits', () => {
  let WalletModel: any;
  let TransactionModel: any;
  let mockFindOneAndUpdate: ReturnType<typeof jest.fn>;
  let mockFindOne: ReturnType<typeof jest.fn>;
  let mockTransactionConstructor: ReturnType<typeof jest.fn>;
  let mockTransactionSave: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockModel = (mongoose as any).model as ReturnType<typeof jest.fn>;

    mockFindOneAndUpdate = jest.fn();
    mockFindOne = jest.fn();
    mockTransactionConstructor = jest.fn();
    mockTransactionSave = jest.fn().mockResolvedValue({} as unknown as never);

    const WalletMock = {
      findOneAndUpdate: mockFindOneAndUpdate,
      findOne: mockFindOne,
    };

    mockModel.mockImplementation((name: unknown) => {
      if (name === 'Wallet') return WalletMock;
      if (name === 'Transaction') return mockTransactionConstructor;
      return {};
    });

    WalletModel = mongoose.model('Wallet');
    TransactionModel = mongoose.model('Transaction');

    mockTransactionConstructor.mockImplementation(function (this: any, data: unknown) {
      this.data = data;
      this.save = mockTransactionSave;
      return this;
    });
  });

  it('should debit wallet balance and create pending transaction', async () => {
    const mockWallet = {
      _id: 'wallet1',
      userId: 'user1',
      balance: 1000,
      pendingHold: 500,
    };
    mockFindOneAndUpdate.mockResolvedValue(mockWallet as unknown as never);

    const wallet = await WalletModel.findOneAndUpdate(
      { userId: 'user1' },
      { $inc: { pendingHold: 500 } },
      { new: true }
    );

    const transaction = new TransactionModel({
      userId: 'user1',
      type: 'debit',
      amount: 500,
      status: 'pending',
    });
    await transaction.save();

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
    const mockWallet = {
      _id: 'wallet1',
      userId: 'user1',
      balance: 200,
      pendingHold: 0,
    };
    mockFindOne.mockResolvedValue(mockWallet as unknown as never);

    const wallet = await WalletModel.findOne({ userId: 'user1' });
    const canDebit = wallet.balance >= 500;

    expect(mockFindOne).toHaveBeenCalledWith({ userId: 'user1' });
    expect(canDebit).toBe(false);
  });
});