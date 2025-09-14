import { useState, useMemo, useEffect } from 'react';
import type { Lead, LeadFilters } from '../types';

const STORAGE_KEY = 'mini-seller-console-filters';

export const useLeadFilters = (leads: Lead[]) => {
  const [filters, setFilters] = useState<LeadFilters>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore errors
    }
    
    return {
      search: '',
      status: '',
      sortBy: 'score',
      sortOrder: 'desc'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // Ignore errors
    }
  }, [filters]);

  const filteredLeads = useMemo(() => {
    let filtered = leads.filter(lead => lead.status !== 'converted');

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue as string);
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      }
      
      const comparison = (aValue as number) - (bValue as number);
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [leads, filters]);

  return {
    filters,
    setFilters,
    filteredLeads,
    updateFilter: (key: keyof LeadFilters, value: string) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
};
