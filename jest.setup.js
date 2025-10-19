import '@testing-library/jest-dom';

// Mock Mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
  },
  model: jest.fn(() => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    deleteOne: jest.fn(),
    // Add more mocks as needed
  })),
  Types: {
    ObjectId: jest.fn(),
  },
  startSession: jest.fn(() => ({
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  })),
}));