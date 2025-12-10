import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIChatWidget } from './AIChatWidget';
import { mockSupabase } from '../../../test/mocks/supabaseMock';

// Mock the supabase client
jest.mock('@/lib/supabaseClient', () => {
  const { mockSupabase } = require('../../../test/mocks/supabaseMock');
  return {
    supabase: mockSupabase,
  };
});

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AIChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the widget correctly', () => {
    render(<AIChatWidget />);
    expect(screen.getByText(/EnviroSense AI/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe your symptoms/i)).toBeInTheDocument();
  });

  it('simulates user typing "I can\'t breathe" and shows High Risk card', async () => {
    render(<AIChatWidget />);

    const input = screen.getByPlaceholderText(/Describe your symptoms/i);
    
    // Simulate typing
    fireEvent.change(input, { target: { value: "I can't breathe" } });
    
    // Find the form and submit it
    const form = input.closest('form');
    expect(form).toBeInTheDocument();
    
    fireEvent.submit(form!);

    // Verify "Thinking" state (Loader/Steps)
    // The component shows "Scanning EU Air Quality Directives..." immediately
    expect(screen.getByText(/Scanning EU Air Quality Directives/i)).toBeInTheDocument();

    // Fast-forward timers to get through the thinking steps
    // The component has a loop with 1500ms delay per step (3 steps)
    // We need to advance timers step by step to allow promises to resolve
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    // Wait for the AI response to be processed
    await waitFor(() => {
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('analyze-risk', expect.objectContaining({
        body: expect.objectContaining({
          symptom_description: "I can't breathe"
        })
      }));
    });

    // Verify High Risk card appears
    // The mock returns risk_level: 'High'
    // The component renders "High Risk Detected"
    const riskAlerts = await screen.findAllByText(/High Risk Detected/i);
    expect(riskAlerts.length).toBeGreaterThan(0);
    
    // Verify the specific red CSS class on the header element
    // The header is likely the first one or the one with the class
    const headerAlert = riskAlerts.find(el => el.tagName === 'DIV' && el.className.includes('text-[#E07A5F]'));
    expect(headerAlert).toBeInTheDocument();
    expect(headerAlert).toHaveClass('text-[#E07A5F]');
  });
});
