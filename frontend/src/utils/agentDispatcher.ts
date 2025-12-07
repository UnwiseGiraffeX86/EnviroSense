export type RiskAssessment = {
  action: 'LOG_ONLY' | 'IMMEDIATE_DISPATCH';
  recipient?: string;
  riskLevel: 'Low' | 'Medium' | 'High - Doctor Alerted';
};

export function analyzeLog(
  breathingStatus: string,
  transcript: string
): RiskAssessment {
  const lowerTranscript = transcript.toLowerCase();
  const emergencyKeywords = ["emergency", "faint", "blood", "can't breathe", "chest pain", "gasping"];

  const hasEmergencyKeyword = emergencyKeywords.some(keyword => lowerTranscript.includes(keyword));
  const isSevereBreathing = breathingStatus === 'Wheezing/Heavy';

  if (isSevereBreathing || hasEmergencyKeyword) {
    return {
      action: 'IMMEDIATE_DISPATCH',
      recipient: 'Dr. Popa',
      riskLevel: 'High - Doctor Alerted'
    };
  }

  return {
    action: 'LOG_ONLY',
    riskLevel: 'Low'
  };
}
