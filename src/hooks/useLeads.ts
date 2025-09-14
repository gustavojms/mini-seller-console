import { useState, useEffect, useCallback } from 'react';
import type { Lead } from '../types';
import { dataService } from '../services/dataService';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const originalLead = leads.find(lead => lead.id === id);
    if (!originalLead) throw new Error('Lead not found');

    const optimisticLead = { ...originalLead, ...updates };
    setLeads(prev => prev.map(lead => 
      lead.id === id ? optimisticLead : lead
    ));

    try {
      const updatedLead = await dataService.updateLead(id, updates);
      setLeads(prev => prev.map(lead => 
        lead.id === id ? updatedLead : lead
      ));
      return updatedLead;
    } catch (err) {
      setLeads(prev => prev.map(lead => 
        lead.id === id ? originalLead : lead
      ));
      throw new Error(err instanceof Error ? err.message : 'Failed to update lead');
    }
  };

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return {
    leads,
    loading,
    error,
    updateLead,
    refreshLeads: loadLeads
  };
};
