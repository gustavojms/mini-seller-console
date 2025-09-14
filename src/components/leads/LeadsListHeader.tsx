import type { LeadFilters } from '../../types';
import { Input } from '../ui/Input';

interface LeadsListHeaderProps {
  filters: LeadFilters;
  onFiltersChange: (key: keyof LeadFilters, value: string) => void;
  totalCount: number;
}

export const LeadsListHeader = ({ filters, onFiltersChange, totalCount }: LeadsListHeaderProps) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">
            Leads ({totalCount})
          </h3>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => onFiltersChange('search', e.target.value)}
              className="w-48"
            />
            
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange('status', e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) => onFiltersChange('sortBy', e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
            </select>
            
            <button
              onClick={() => onFiltersChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
