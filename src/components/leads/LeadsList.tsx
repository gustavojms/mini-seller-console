import type { Lead, LeadFilters } from '../../types';
import { LeadsListHeader } from './LeadsListHeader';
import { LeadsListItem } from './LeadsListItem';
import { PaginationControls } from '../ui/PaginationControls';
import { usePagination } from '../../hooks/usePagination';

interface LeadsListProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  onLeadView: (lead: Lead) => void;
  onLeadEdit: (lead: Lead) => void;
  onLeadConvert: (lead: Lead) => void;
  onFiltersChange: (key: keyof LeadFilters, value: string) => void;
  filters: LeadFilters;
}

export const LeadsList = ({ 
  leads, 
  loading, 
  error, 
  onLeadView,
  onLeadEdit,
  onLeadConvert,
  onFiltersChange, 
  filters 
}: LeadsListProps) => {
  const {
    page,
    pageSize,
    totalPages,
    total,
    paginatedItems: paginatedLeads,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPrevPage,
  } = usePagination(leads, 25);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">Error loading leads: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <LeadsListHeader 
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalCount={leads.length}
      />
      
      {leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {paginatedLeads.map((lead) => (
              <LeadsListItem
                key={lead.id}
                lead={lead}
                onView={() => onLeadView(lead)}
                onEdit={() => onLeadEdit(lead)}
                onConvert={() => onLeadConvert(lead)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <PaginationControls
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              total={total}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
            />
          )}
        </>
      )}
    </div>
  );
};
