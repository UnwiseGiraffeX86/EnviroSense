import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DoctorDashboard from './DoctorDashboard';

describe('DoctorDashboard', () => {
  const mockOnAcceptCase = jest.fn();
  const mockOnSelectCase = jest.fn();
  const mockOnSendMessage = jest.fn();

  const mockQueue = [
    {
      id: 'case-123',
      profiles: { full_name: 'John Doe' },
      ai_analysis: { severity: 'High' },
      initial_symptoms: 'Difficulty breathing',
      created_at: new Date().toISOString(),
      status: 'waiting_doctor'
    }
  ];

  const mockActiveCase = {
    id: 'case-123',
    profiles: { full_name: 'John Doe' },
    status: 'waiting_doctor'
  };

  it('calls onAcceptCase when "Accept Case" button is clicked', () => {
    render(
      <DoctorDashboard
        queue={mockQueue}
        activeCase={mockActiveCase}
        onAcceptCase={mockOnAcceptCase}
        onSelectCase={mockOnSelectCase}
        messages={[]}
        onSendMessage={mockOnSendMessage}
      />
    );

    // Find the Accept Case button
    const acceptButton = screen.getByText(/Accept Case/i);
    expect(acceptButton).toBeInTheDocument();
    
    // Click it
    fireEvent.click(acceptButton);

    // Verify prop was called with the correct ID
    expect(mockOnAcceptCase).toHaveBeenCalledWith('case-123');
  });
});
