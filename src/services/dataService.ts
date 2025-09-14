import leadsData from '../data/leads.json';
import type { Lead, Opportunity } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const LEADS_STORAGE_KEY = 'mini-seller-console-leads';
const OPPORTUNITIES_STORAGE_KEY = 'mini-seller-console-opportunities';

export class DataService {
  private leads: Lead[] = [];
  private opportunities: Opportunity[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (storedLeads) {
      try {
        this.leads = JSON.parse(storedLeads);
      } catch {
        this.leads = leadsData as Lead[];
        this.saveLeadsToStorage();
      }
    } else {
      this.leads = leadsData as Lead[];
      this.saveLeadsToStorage();
    }

    const storedOpportunities = localStorage.getItem(OPPORTUNITIES_STORAGE_KEY);
    if (storedOpportunities) {
      try {
        this.opportunities = JSON.parse(storedOpportunities);
      } catch {
        this.opportunities = [];
      }
    } else {
      this.opportunities = [];
    }
  }

  private saveLeadsToStorage() {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(this.leads));
    } catch {
      // Silent fail
    }
  }

  private saveOpportunitiesToStorage() {
    try {
      localStorage.setItem(OPPORTUNITIES_STORAGE_KEY, JSON.stringify(this.opportunities));
    } catch {
      // Silent fail
    }
  }

  async getLeads(): Promise<Lead[]> {
    await delay(500);
    return [...this.leads];
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    await delay(300);
    const leadIndex = this.leads.findIndex(lead => lead.id === id);
    if (leadIndex === -1) throw new Error('Lead not found');
    
    this.leads[leadIndex] = { ...this.leads[leadIndex], ...updates };
    this.saveLeadsToStorage();
    return this.leads[leadIndex];
  }

  async convertLeadToOpportunity(leadId: string, opportunityData: Omit<Opportunity, 'id' | 'leadId'>): Promise<Opportunity> {
    await delay(400);
    const leadIndex = this.leads.findIndex(l => l.id === leadId);
    if (leadIndex === -1) throw new Error('Lead not found');

    const opportunity: Opportunity = {
      id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      leadId,
      ...opportunityData
    };

    this.opportunities.push(opportunity);
    this.saveOpportunitiesToStorage();

    this.leads[leadIndex] = { ...this.leads[leadIndex], status: 'converted' };
    this.saveLeadsToStorage();

    return opportunity;
  }

  async getOpportunities(): Promise<Opportunity[]> {
    await delay(200);
    return [...this.opportunities];
  }

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
    await delay(300);
    const opportunityIndex = this.opportunities.findIndex(opp => opp.id === id);
    if (opportunityIndex === -1) throw new Error('Opportunity not found');
    
    this.opportunities[opportunityIndex] = { ...this.opportunities[opportunityIndex], ...updates };
    this.saveOpportunitiesToStorage();
    return this.opportunities[opportunityIndex];
  }

  async resetData(): Promise<void> {
    this.leads = leadsData as Lead[];
    this.opportunities = [];
    this.saveLeadsToStorage();
    this.saveOpportunitiesToStorage();
  }

  clearStorage(): void {
    localStorage.removeItem(LEADS_STORAGE_KEY);
    localStorage.removeItem(OPPORTUNITIES_STORAGE_KEY);
    this.initializeData();
  }
}

export const dataService = new DataService();
