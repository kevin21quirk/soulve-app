
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

export const mapCategoryToDb = (displayCategory: string): string => {
  return CATEGORY_MAPPING[displayCategory as keyof typeof CATEGORY_MAPPING] || displayCategory.toLowerCase().replace(/\s+/g, '-');
};

export const mapCategoryFromDb = (dbCategory: string): string => {
  const entry = Object.entries(CATEGORY_MAPPING).find(([_, value]) => value === dbCategory);
  return entry ? entry[0] : dbCategory;
};
