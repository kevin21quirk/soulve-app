
// Simple mapping between display categories and database values
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

// Valid database category values - these should match exactly what's in the database
export const VALID_DB_CATEGORIES = [
  'help-needed', 'help-offered', 'success-story', 'announcement', 
  'question', 'recommendation', 'event', 'lost-found'
] as const;

export const mapCategoryToDb = (displayCategory: string): string => {
  console.log('categoryMapping - Input category:', displayCategory);
  
  // If the category is already in database format, return it
  if (VALID_DB_CATEGORIES.includes(displayCategory as any)) {
    console.log('categoryMapping - Already in DB format:', displayCategory);
    return displayCategory;
  }
  
  // Try to map from display name to database value
  const mapped = CATEGORY_MAPPING[displayCategory as keyof typeof CATEGORY_MAPPING];
  if (mapped) {
    console.log('categoryMapping - Mapped to:', mapped);
    return mapped;
  }
  
  // If no mapping found, log error and return a safe default
  console.error('categoryMapping - No mapping found for:', displayCategory);
  return 'help-needed'; // Safe default
};

export const mapCategoryFromDb = (dbCategory: string): string => {
  const entry = Object.entries(CATEGORY_MAPPING).find(([_, value]) => value === dbCategory);
  return entry ? entry[0] : dbCategory;
};
