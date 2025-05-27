
export const getTrustScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600 bg-green-100 border-green-200";
  if (score >= 80) return "text-blue-600 bg-blue-100 border-blue-200";
  if (score >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200";
  return "text-red-600 bg-red-100 border-red-200";
};
