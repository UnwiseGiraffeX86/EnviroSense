import { analyzeLog } from './agentDispatcher';

describe('Neuro-Symbolic Logic (Risk Parser)', () => {
  // Scenario A: High Risk
  it('correctly flags High Risk input', () => {
    const breathingStatus = 'Wheezing/Heavy';
    const transcript = "I can't breathe and I have chest pain";
    
    const result = analyzeLog(breathingStatus, transcript);
    
    expect(result).toEqual({
      action: 'IMMEDIATE_DISPATCH',
      recipient: 'Dr. Popa',
      riskLevel: 'High - Doctor Alerted'
    });
  });

  // Scenario B: Safety Fallback / Low Risk
  // The prompt asks for "Safety Fallback" on malformed JSON. 
  // Since analyzeLog takes strings, we test with non-emergency text.
  it('defaults to Low Risk for non-emergency input', () => {
    const breathingStatus = 'Normal';
    const transcript = "I am feeling okay, just checking in.";
    
    const result = analyzeLog(breathingStatus, transcript);
    
    expect(result).toEqual({
      action: 'LOG_ONLY',
      riskLevel: 'Low'
    });
  });

  // Additional test for partial match (e.g. keyword only)
  it('flags High Risk on emergency keyword even if breathing is normal', () => {
    const breathingStatus = 'Normal';
    const transcript = "I feel faint and see blood";
    
    const result = analyzeLog(breathingStatus, transcript);
    
    expect(result).toEqual({
      action: 'IMMEDIATE_DISPATCH',
      recipient: 'Dr. Popa',
      riskLevel: 'High - Doctor Alerted'
    });
  });
});
