import { Users, Megaphone, UsersRound, Building2, FileText, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchResults, SearchResult } from "@/hooks/useGlobalSearch";
import { useNavigate } from "react-router-dom";

interface GlobalSearchResultsProps {
  results: SearchResults;
  loading: boolean;
  query: string;
  onResultClick: () => void;
}

const GlobalSearchResults = ({ results, loading, query, onResultClick }: GlobalSearchResultsProps) => {
  const navigate = useNavigate();

  const handleResultClick = (result: SearchResult) => {
    onResultClick();
    
    // Navigate based on type
    switch (result.type) {
      case 'user':
        navigate(`/profile/${result.id}`);
        break;
      case 'campaign':
        navigate(`/campaign/${result.id}`);
        break;
      case 'group':
        navigate(`/group/${result.id}`);
        break;
      case 'organization':
        navigate(`/organization/${result.id}`);
        break;
      case 'post':
        navigate(`/dashboard?tab=social`);
        break;
      case 'opportunity':
        navigate(`/dashboard?tab=discover`);
        break;
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'campaign': return <Megaphone className="h-4 w-4" />;
      case 'group': return <UsersRound className="h-4 w-4" />;
      case 'organization': return <Building2 className="h-4 w-4" />;
      case 'post': return <FileText className="h-4 w-4" />;
      case 'opportunity': return <Heart className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'user': return 'People';
      case 'campaign': return 'Campaigns';
      case 'group': return 'Groups';
      case 'organization': return 'Organizations';
      case 'post': return 'Posts';
      case 'opportunity': return 'Opportunities';
      default: return type;
    }
  };

  const renderResultItem = (result: SearchResult) => (
    <div
      key={result.id}
      onClick={() => handleResultClick(result)}
      className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex items-start gap-3">
        {result.imageUrl ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={result.imageUrl} />
            <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {getCategoryIcon(result.type)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{result.title}</p>
            <Badge variant="secondary" className="text-xs">
              {getCategoryLabel(result.type)}
            </Badge>
          </div>
          {result.subtitle && (
            <p className="text-xs text-muted-foreground">{result.subtitle}</p>
          )}
          {result.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {result.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCategory = (categoryResults: SearchResult[], categoryType: string) => {
    if (categoryResults.length === 0) return null;

    return (
      <div key={categoryType} className="mb-4">
        <div className="flex items-center gap-2 mb-2 px-3">
          {getCategoryIcon(categoryType)}
          <h3 className="font-semibold text-sm">
            {getCategoryLabel(categoryType)} ({categoryResults.length})
          </h3>
        </div>
        <div className="space-y-1">
          {categoryResults.map(renderResultItem)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Searching...</p>
      </Card>
    );
  }

  if (!query || query.trim().length < 2) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Start typing to search across users, campaigns, groups, organizations, and more...
        </p>
      </Card>
    );
  }

  if (results.totalCount === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No results found for "{query}"
        </p>
      </Card>
    );
  }

  return (
    <Card className="max-h-[500px] overflow-y-auto">
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Found {results.totalCount} results for "{query}"
        </p>
        
        {renderCategory(results.users, 'user')}
        {renderCategory(results.campaigns, 'campaign')}
        {renderCategory(results.groups, 'group')}
        {renderCategory(results.organizations, 'organization')}
        {renderCategory(results.posts, 'post')}
        {renderCategory(results.opportunities, 'opportunity')}
      </div>
    </Card>
  );
};

export default GlobalSearchResults;