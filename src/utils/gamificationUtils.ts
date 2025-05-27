
export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "bg-gray-100 text-gray-700 border-gray-300";
    case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
    case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
    case "legendary": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export const calculateLevelProgress = (totalPoints: number) => {
  return ((totalPoints % 300) / 300) * 100;
};
