import type { Lead } from '../../types';
import { PencilIcon, ArrowRightCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Dropdown, type DropdownAction } from '../ui/Dropdown';

interface LeadsListItemProps {
  lead: Lead;
  onView: () => void;
  onEdit: () => void;
  onConvert: () => void;
}

export const LeadsListItem = ({ lead, onView, onEdit, onConvert }: LeadsListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const dropdownActions: DropdownAction[] = [
    {
      label: 'View',
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: onView
    },
    {
      label: 'Edit',
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: onEdit
    },
    ...(lead.status !== 'converted' ? [{
      label: 'Convert',
      icon: <ArrowRightCircleIcon className="h-4 w-4" />,
      onClick: onConvert
    }] : [])
  ];

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
              <p className="text-sm text-gray-500 truncate">{lead.company} • {lead.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right w-20 hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Score: {lead.score}</p>
            <p className="text-xs text-gray-500">{lead.source}</p>
          </div>
          
          <div className="text-right w-16 sm:hidden">
            <p className="text-sm font-medium text-gray-900">{lead.score}</p>
          </div>
          
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 w-20 justify-center ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="View details"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            
            {lead.status !== 'converted' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Quick edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConvert();
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Convert to opportunity"
                >
                  <ArrowRightCircleIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <Dropdown actions={dropdownActions} />
          </div>
        </div>
      </div>
    </div>
  );
};
