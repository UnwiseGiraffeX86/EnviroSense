export const mockSupabase = {
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' },
        },
      },
      error: null,
    }),
    getUser: jest.fn().mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
      },
      error: null,
    }),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation((callback) => callback({ data: [], error: null })),
  })),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockImplementation((callback) => {
      if (callback) callback('SUBSCRIBED');
      return {
        unsubscribe: jest.fn(),
      };
    }),
  })),
  functions: {
    invoke: jest.fn().mockResolvedValue({
      data: {
        risk_level: 'High',
        recommendation: 'See a doctor immediately.',
        analysis: 'High risk detected.',
        regulatory_context: 'EU Directive Alert',
      },
      error: null,
    }),
  },
};

// Default export for mocking modules
export default mockSupabase;
