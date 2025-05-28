
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedUrgency: string;
  setSelectedUrgency: (urgency: string) => void;
}

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedUrgency,
  setSelectedUrgency
}: SearchFiltersProps) => {
  return (
    <Card className="border-teal-200 bg-gradient-to-r from-teal-50/50 to-blue-50/50">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-teal-600" />
              <Input 
                placeholder="Search for causes, people, organizations..." 
                className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-teal-200 rounded-md text-sm focus:border-teal-500 focus:ring-teal-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="social">Social Justice</option>
            </select>
            <select 
              className="px-3 py-2 border border-teal-200 rounded-md text-sm focus:border-teal-500 focus:ring-teal-200"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">All Urgency</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <Button variant="outline" size="sm" className="border-teal-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300">
              <Filter className="h-4 w-4 text-teal-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
