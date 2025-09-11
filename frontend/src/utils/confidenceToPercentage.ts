/**
 * Convert confidence level to percentage
 * @param confidence 
 * @returns confidence in percentage
 */
export const confidenceToPercentage = (confidence: string): number => {
  switch (confidence) {
    case "HIGH": return 90;
    case "MEDIUM": return 70;
    case "LOW": return 30;
    default: return 50;
  }
}