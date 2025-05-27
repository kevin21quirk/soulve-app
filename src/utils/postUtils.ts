
export const getCategoryColor = (category: string) => {
  switch (category) {
    case "help-needed": return "border-l-red-500 bg-red-50";
    case "help-offered": return "border-l-green-500 bg-green-50";
    case "success-story": return "border-l-blue-500 bg-blue-50";
    default: return "border-l-gray-500 bg-gray-50";
  }
};

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case "help-needed": return "Help Needed";
    case "help-offered": return "Help Offered";
    case "success-story": return "Success Story";
    default: return category;
  }
};
