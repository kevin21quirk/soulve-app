
interface NotificationFiltersProps {
  sortBy: "newest" | "priority" | "unread";
  onSortChange: (sortBy: "newest" | "priority" | "unread") => void;
}

const NotificationFilters = ({ sortBy, onSortChange }: NotificationFiltersProps) => {
  return (
    <div className="flex items-center space-x-2 pt-2">
      <select 
        value={sortBy} 
        onChange={(e) => onSortChange(e.target.value as any)}
        className="text-xs border rounded px-2 py-1"
      >
        <option value="newest">Newest first</option>
        <option value="priority">Priority</option>
        <option value="unread">Unread first</option>
      </select>
    </div>
  );
};

export default NotificationFilters;
