
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar, TrendingUp, CheckCircle, Clock, X } from "lucide-react";
import { PointTransaction, PointCategory } from "@/types/gamification";
import { PointsCalculator } from "@/services/pointsService";

interface PointsTransactionHistoryProps {
  transactions: PointTransaction[];
}

const PointsTransactionHistory = ({ transactions }: PointsTransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(transactions.map(t => t.category)));
    return categories.map(cat => ({
      value: cat,
      label: PointsCalculator.getCategoryDisplayName(cat)
    }));
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           PointsCalculator.getCategoryDisplayName(transaction.category).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
      
      // Verification filter
      const matchesVerification = verificationFilter === "all" || 
                                 (verificationFilter === "verified" && transaction.verified) ||
                                 (verificationFilter === "pending" && !transaction.verified);

      return matchesSearch && matchesCategory && matchesVerification;
    });

    // Sort transactions
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case "highest":
        filtered.sort((a, b) => b.points - a.points);
        break;
      case "lowest":
        filtered.sort((a, b) => a.points - b.points);
        break;
    }

    return filtered;
  }, [transactions, searchTerm, categoryFilter, verificationFilter, sortBy]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: PointCategory) => {
    return PointsCalculator.getCategoryIcon(category);
  };

  const getCategoryColor = (category: PointCategory) => {
    const color = PointsCalculator.getCategoryColor(category);
    return `bg-${color}-100 text-${color}-800 border-${color}-200`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setVerificationFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || verificationFilter !== "all" || sortBy !== "newest";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Points Transaction History</span>
        </CardTitle>
        <CardDescription>
          View your complete points earning history with detailed breakdowns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters Section */}
        <div className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters & Search</span>
            </h4>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Verification Filter */}
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Points</SelectItem>
                <SelectItem value="lowest">Lowest Points</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {searchTerm && (
                <Badge variant="outline" className="bg-blue-50">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="outline" className="bg-green-50">
                  Category: {availableCategories.find(c => c.value === categoryFilter)?.label}
                </Badge>
              )}
              {verificationFilter !== "all" && (
                <Badge variant="outline" className="bg-yellow-50">
                  Status: {verificationFilter}
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge variant="outline" className="bg-purple-50">
                  Sort: {sortBy.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
          {hasActiveFilters && " (filtered)"}
        </div>

        {/* Transactions Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.multiplier !== 1 && (
                        <div className="text-xs text-gray-500">
                          Base: {transaction.basePoints} pts × {transaction.multiplier.toFixed(2)} multiplier
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                      <span className="mr-1">{getCategoryIcon(transaction.category)}</span>
                      {PointsCalculator.getCategoryDisplayName(transaction.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaction.timestamp)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-bold text-green-600">+{transaction.points}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500 mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No transactions found</p>
            <p className="text-sm">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "Start helping others to earn your first points!"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsTransactionHistory;
