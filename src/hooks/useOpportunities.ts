import { useState, useEffect, useCallback } from 'react';
import type { Opportunity } from '../types';
import { dataService } from '../services/dataService';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, []);

  const addOpportunity = useCallback(async (opportunity: Opportunity) => {
    setOpportunities(prev => [...prev, opportunity]);
    
    try {
      await loadOpportunities();
    } catch (err) {
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunity.id));
      throw err;
    }
  }, [loadOpportunities]);

  const updateOpportunity = useCallback(async (id: string, updates: Partial<Opportunity>) => {
    const originalOpportunity = opportunities.find(opp => opp.id === id);
    if (!originalOpportunity) throw new Error('Opportunity not found');

    const optimisticOpportunity = { ...originalOpportunity, ...updates };
    setOpportunities(prev => prev.map(opp => 
      opp.id === id ? optimisticOpportunity : opp
    ));

    try {
      const updatedOpportunity = await dataService.updateOpportunity(id, updates);
      setOpportunities(prev => prev.map(opp => 
        opp.id === id ? updatedOpportunity : opp
      ));
      return updatedOpportunity;
    } catch (err) {
      setOpportunities(prev => prev.map(opp => 
        opp.id === id ? originalOpportunity : opp
      ));
      throw new Error(err instanceof Error ? err.message : 'Failed to update opportunity');
    }
  }, [opportunities]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  return {
    opportunities,
    loading,
    error,
    addOpportunity,
    updateOpportunity,
    refreshOpportunities: loadOpportunities
  };
};
