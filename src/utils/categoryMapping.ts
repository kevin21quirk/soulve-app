
// Mapping between display categories and database values
export const CATEGORY_MAPPING = {
  'Help Needed': 'help-needed',
  'Help Offered': 'help-offered', 
  'Success Story': 'success-story',
  'Announcement': 'announcement',
  'Question': 'question',
  'Recommendation': 'recommendation',
  'Event': 'event',
  'Lost & Found': 'lost-found'
} as const;

// Valid database category values
const VALID_DB_CATEGORIES = [
  'help-needed', 'help-offered', 'success-story', 'announcement', 
  'question', 'recommendation', 'event', 'lost-found'
];

export const mapCategoryToDb = (displayCategory: string): string => {
  console.log('categoryMapping - Input category:', displayCategory);
  
  // If the category is already in database format, return it
  if (VALID_DB_CATEGORIES.includes(displayCategory)) {
    console.log('categoryMapping - Already in DB format:', displayCategory);
    return displayCategory;
  }
  
  // Try to map from display name to database value
  const mapped = CATEGORY_MAPPING[displayCategory as keyof typeof CATEGORY_MAPPING];
  if (mapped) {
    console.log('categoryMapping - Mapped to:', mapped);
    return mapped;
  }
  
  // Fallback: convert to kebab-case
  const fallback = displayCategory.toLowerCase().replace(/\s+/g, '-');
  console.log('categoryMapping - Fallback conversion:', fallback);
  return fallback;
};

export const mapCategoryFromDb = (dbCategory: string): string => {
  const entry = Object.entries(CATEGORY_MAPPING).find(([_, value]) => value === dbCategory);
  return entry ? entry[0] : dbCategory;
};
