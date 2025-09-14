import type { Opportunity } from '../../types';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Dropdown, type DropdownAction } from '../ui/Dropdown';

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  loading: boolean;
  onOpportunityView?: (opportunity: Opportunity) => void;
  onOpportunityEdit?: (opportunity: Opportunity) => void;
}

export const OpportunitiesTable = ({ opportunities, loading, onOpportunityView, onOpportunityEdit }: OpportunitiesTableProps) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Opportunities ({opportunities.length})
        </h3>
        
        {opportunities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No opportunities yet. Convert some leads to get started!
          </p>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                                {opportunities.map((opportunity) => {
                  const dropdownActions: DropdownAction[] = [
                    ...(onOpportunityView ? [{
                      label: 'View',
                      icon: <EyeIcon className="h-4 w-4" />,
                      onClick: () => onOpportunityView(opportunity)
                    }] : []),
                    ...(onOpportunityEdit ? [{
                      label: 'Edit',
                      icon: <PencilIcon className="h-4 w-4" />,
                      onClick: () => onOpportunityEdit(opportunity)
                    }] : [])
                  ];

                  return (
                    <tr key={opportunity.id} className="bg-white hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {opportunity.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {opportunity.accountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          opportunity.stage === 'proposal' ? 'bg-yellow-100 text-yellow-800' :
                          opportunity.stage === 'negotiation' ? 'bg-blue-100 text-blue-800' :
                          opportunity.stage === 'closed-won' ? 'bg-green-100 text-green-800' :
                          opportunity.stage === 'closed-lost' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {opportunity.stage.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {opportunity.amount ? `$${opportunity.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Desktop Actions */}
                        <div className="hidden sm:flex items-center space-x-2 justify-end">
                          {onOpportunityView && (
                            <button
                              onClick={() => onOpportunityView(opportunity)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View opportunity"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          )}
                          {onOpportunityEdit && (
                            <button
                              onClick={() => onOpportunityEdit(opportunity)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit opportunity"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {/* Mobile Dropdown */}
                        <div className="sm:hidden">
                          {dropdownActions.length > 0 && (
                            <Dropdown actions={dropdownActions} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
