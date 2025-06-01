
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Home, 
  Utensils,
  Stethoscope,
  TreePine,
  Hammer,
  BookOpen
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
  color: string;
  description: string;
}

interface DiscoverCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory?: string;
}

const DiscoverCategories = ({ onCategorySelect, selectedCategory }: DiscoverCategoriesProps) => {
  const categories: Category[] = [
    {
      id: 'help_needed',
      name: 'Help Needed',
      icon: Heart,
      count: 127,
      color: 'text-red-500 bg-red-50 border-red-200',
      description: 'Direct assistance requests'
    },
    {
      id: 'volunteer',
      name: 'Volunteer',
      icon: Users,
      count: 89,
      color: 'text-blue-500 bg-blue-50 border-blue-200',
      description: 'Ongoing volunteer opportunities'
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Briefcase,
      count: 56,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      description: 'Career and business help'
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      count: 73,
      color: 'text-green-500 bg-green-50 border-green-200',
      description: 'Learning and teaching'
    },
    {
      id: 'housing',
      name: 'Housing',
      icon: Home,
      count: 34,
      color: 'text-orange-500 bg-orange-50 border-orange-200',
      description: 'Housing and shelter support'
    },
    {
      id: 'food',
      name: 'Food & Nutrition',
      icon: Utensils,
      count: 42,
      color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
      description: 'Food assistance and nutrition'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: Stethoscope,
      count: 61,
      color: 'text-pink-500 bg-pink-50 border-pink-200',
      description: 'Health and medical support'
    },
    {
      id: 'environment',
      name: 'Environment',
      icon: TreePine,
      count: 28,
      color: 'text-teal-500 bg-teal-50 border-teal-200',
      description: 'Environmental initiatives'
    },
    {
      id: 'community',
      name: 'Community',
      icon: Hammer,
      count: 94,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
      description: 'Community building projects'
    },
    {
      id: 'resources',
      name: 'Resources',
      icon: BookOpen,
      count: 38,
      color: 'text-gray-500 bg-gray-50 border-gray-200',
      description: 'Shared resources and materials'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? `border-2 ${category.color}` : 'hover:scale-105'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverCategories;
