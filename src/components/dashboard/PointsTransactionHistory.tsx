
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, TrendingUp, ExternalLink, Clock } from "lucide-react";
import { PointTransaction } from "@/types/gamification";
import { useState } from "react";

interface PointsTransactionHistoryProps {
  transactions: PointTransaction[];
}

const PointsTransactionHistory = ({ transactions }: PointsTransactionHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayTransactions = showAll ? transactions : transactions.slice(0, 10);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'help_completed': '🤝',
      'emergency_help': '🚨',
      'donation': '💰',
      'profile_verification': '✅',
      'positive_feedback': '⭐',
      'user_referral': '👥',
      'recurring_help': '🔄',
      'group_help': '👨‍👩‍👧‍👦',
      'matching_donation': '💝',
      'fundraiser_created': '🎯',
      'community_group_created': '🏘️',
      'community_event_organized': '🎪'
    };
    return icons[category] || '📊';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'help_completed': 'bg-blue-100 text-blue-800',
      'emergency_help': 'bg-red-100 text-red-800',
      'donation': 'bg-green-100 text-green-800',
      'profile_verification': 'bg-purple-100 text-purple-800',
      'positive_feedback': 'bg-yellow-100 text-yellow-800',
      'user_referral': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Points History</span>
        </CardTitle>
        <CardDescription>
          Your recent point-earning activities and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {transactions.reduce((sum, t) => sum + t.points, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {transactions.filter(t => 
                  new Date(t.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).reduce((sum, t) => sum + t.points, 0)}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {Math.round(transactions.reduce((sum, t) => sum + t.points, 0) / transactions.length)}
              </div>
              <div className="text-sm text-gray-600">Avg/Activity</div>
            </div>
          </div>

          {/* Transaction Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                      <div>
                        <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                          {formatCategory(transaction.category)}
                        </Badge>
                        {transaction.multiplier > 1 && (
                          <Badge variant="outline" className="ml-1 bg-orange-50 text-orange-700">
                            {transaction.multiplier}x
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate">{transaction.description}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {transaction.verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            Verified
                          </Badge>
                        )}
                        {transaction.relatedEntityId && (
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900">{formatTimeAgo(transaction.timestamp)}</div>
                      <div className="text-gray-500 text-xs">{formatDate(transaction.timestamp)}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600">+{transaction.points}</span>
                    </div>
                    {transaction.multiplier > 1 && (
                      <div className="text-xs text-gray-500 text-right">
                        {transaction.basePoints} × {transaction.multiplier}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {transactions.length > 10 && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                {showAll ? 'Show Less' : `Show All ${transactions.length} Transactions`}
              </Button>
            </div>
          )}

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No point transactions yet.</p>
              <p className="text-sm">Start helping others to earn your first points!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsTransactionHistory;
