
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  selectedUrgency?: string;
  setSelectedUrgency?: (urgency: string) => void;
  onClose?: () => void;
}

const SearchFilters = ({
  searchQuery = "",
  setSearchQuery = () => {},
  selectedCategory = "all",
  setSelectedCategory = () => {},
  selectedUrgency = "all",
  setSelectedUrgency = () => {},
  onClose
}: SearchFiltersProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search for causes, people, organizations..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border rounded-md text-sm"
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
              className="px-3 py-2 border rounded-md text-sm"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">All Urgency</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
