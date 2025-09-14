import { useState } from 'react';
import type { Lead, Opportunity } from './types';
import { useLeads } from './hooks/useLeads';
import { useLeadFilters } from './hooks/useLeadFilters';
import { useOpportunities } from './hooks/useOpportunities';
import { dataService } from './services/dataService';
import { LeadsList } from './components/leads/LeadsList';
import { ViewLeadModal } from './components/leads/ViewLeadModal';
import { QuickEditLeadModal } from './components/leads/QuickEditLeadModal';
import { ConvertLeadModal } from './components/leads/ConvertLeadModal';
import { OpportunitiesTable } from './components/opportunities/OpportunitiesTable';
import { ViewOpportunityModal } from './components/opportunities/ViewOpportunityModal';
import { EditOpportunityModal } from './components/opportunities/EditOpportunityModal';

function App() {
  const { leads, loading, error, updateLead, refreshLeads } = useLeads();
  const { filters, filteredLeads, updateFilter } = useLeadFilters(leads);
  const { opportunities, loading: opportunitiesLoading, updateOpportunity, refreshOpportunities } = useOpportunities();
  
  const [viewModalLead, setViewModalLead] = useState<Lead | null>(null);
  const [editModalLead, setEditModalLead] = useState<Lead | null>(null);
  const [convertModalLead, setConvertModalLead] = useState<Lead | null>(null);
  
  const [viewModalOpportunity, setViewModalOpportunity] = useState<Opportunity | null>(null);
  const [editModalOpportunity, setEditModalOpportunity] = useState<Opportunity | null>(null);

  const handleLeadView = (lead: Lead) => setViewModalLead(lead);
  const handleLeadEdit = (lead: Lead) => setEditModalLead(lead);
  const handleLeadConvert = (lead: Lead) => setConvertModalLead(lead);
  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    await updateLead(id, updates);
  };

  const handleOpportunityView = (opportunity: Opportunity) => setViewModalOpportunity(opportunity);
  const handleOpportunityEdit = (opportunity: Opportunity) => setEditModalOpportunity(opportunity);
  const handleUpdateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    await updateOpportunity(id, updates);
  };

  const handleConvertConfirm = async (leadId: string, opportunityData: Omit<Opportunity, 'id' | 'leadId'>) => {
    try {
      await dataService.convertLeadToOpportunity(leadId, opportunityData);
      await Promise.all([refreshLeads(), refreshOpportunities()]);
      setConvertModalLead(null);
    } catch (error) {
      console.error('Failed to convert lead:', error);
    }
  };

  const isAnyModalOpen = !!viewModalLead || !!editModalLead || !!convertModalLead || !!viewModalOpportunity || !!editModalOpportunity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isAnyModalOpen ? 'blur-sm' : ''}`}>
        <div className="mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Mini Seller Console</h1>
          <p className="mt-2 text-gray-600">Manage leads and convert them to opportunities</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 max-w-none mx-auto" style={{maxWidth: '1600px'}}>
          <div className="order-1 xl:min-w-[700px]">
            <LeadsList
              leads={filteredLeads}
              loading={loading}
              error={error}
              onLeadView={handleLeadView}
              onLeadEdit={handleLeadEdit}
              onLeadConvert={handleLeadConvert}
              onFiltersChange={updateFilter}
              filters={filters}
            />
          </div>
          <div className="order-2 xl:min-w-[700px]">
            <OpportunitiesTable 
              opportunities={opportunities} 
              loading={opportunitiesLoading}
              onOpportunityView={handleOpportunityView}
              onOpportunityEdit={handleOpportunityEdit}
            />
          </div>
        </div>
      </div>

      <ViewLeadModal
        lead={viewModalLead}
        isOpen={!!viewModalLead}
        onClose={() => setViewModalLead(null)}
        onEdit={() => {
          if (viewModalLead) {
            setEditModalLead(viewModalLead);
            setViewModalLead(null);
          }
        }}
        onConvert={() => {
          if (viewModalLead) {
            setConvertModalLead(viewModalLead);
            setViewModalLead(null);
          }
        }}
      />

      <QuickEditLeadModal
        lead={editModalLead}
        isOpen={!!editModalLead}
        onClose={() => setEditModalLead(null)}
        onSave={handleUpdateLead}
      />

      <ConvertLeadModal
        lead={convertModalLead}
        isOpen={!!convertModalLead}
        onClose={() => setConvertModalLead(null)}
        onConvert={handleConvertConfirm}
      />

      <ViewOpportunityModal
        opportunity={viewModalOpportunity}
        isOpen={!!viewModalOpportunity}
        onClose={() => setViewModalOpportunity(null)}
        onEdit={() => {
          if (viewModalOpportunity) {
            setEditModalOpportunity(viewModalOpportunity);
            setViewModalOpportunity(null);
          }
        }}
      />

      <EditOpportunityModal
        opportunity={editModalOpportunity}
        isOpen={!!editModalOpportunity}
        onClose={() => setEditModalOpportunity(null)}
        onSave={handleUpdateOpportunity}
      />
    </div>
  );
}

export default App;
