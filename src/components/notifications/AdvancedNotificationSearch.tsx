import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export interface NotificationFilters {
  searchTerm?: string;
  type?: string;
  priority?: string;
  isRead?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

interface AdvancedNotificationSearchProps {
  onFilterChange: (filters: NotificationFilters) => void;
  onClear: () => void;
}

const AdvancedNotificationSearch = ({
  onFilterChange,
  onClear,
}: AdvancedNotificationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [readStatus, setReadStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleSearch = () => {
    const filters: NotificationFilters = {
      searchTerm: searchTerm || undefined,
      type: type || undefined,
      priority: priority || undefined,
      isRead: readStatus === 'read' ? true : readStatus === 'unread' ? false : undefined,
      dateFrom,
      dateTo,
    };
    onFilterChange(filters);
  };

  const handleClear = () => {
    setSearchTerm('');
    setType('');
    setPriority('');
    setReadStatus('');
    setDateFrom(undefined);
    setDateTo(undefined);
    onClear();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="donation">Donation</SelectItem>
            <SelectItem value="comment">Comment</SelectItem>
            <SelectItem value="follow">Follow</SelectItem>
            <SelectItem value="message">Message</SelectItem>
            <SelectItem value="campaign">Campaign</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={readStatus} onValueChange={setReadStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateFrom ? format(dateFrom, 'MMM dd') : 'From'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateTo ? format(dateTo, 'MMM dd') : 'To'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default AdvancedNotificationSearch;
