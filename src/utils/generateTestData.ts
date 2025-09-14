import type { Lead } from '../types';

const names = [
  'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Brown', 'Chris Wilson',
  'Jessica Taylor', 'David Anderson', 'Lisa Martinez', 'Robert Lee', 'Amanda Clark',
  'Kevin Rodriguez', 'Michelle White', 'Brian Thompson', 'Rachel Garcia', 'Steven Miller'
];

const companies = [
  'Tech Corp', 'Innovation Ltd', 'Digital Solutions', 'Future Systems', 'Smart Enterprises',
  'NextGen Technologies', 'Cloud Dynamics', 'Data Insights', 'Mobile First', 'AI Innovations',
  'Blockchain Solutions', 'Cyber Security Pro', 'IoT Masters', 'Machine Learning Labs', 'DevOps Central'
];

const sources = ['website', 'referral', 'social media', 'cold email', 'trade show'];
const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'unqualified'];

export const generateTestLeads = (count: number = 100): Lead[] => {
  return Array.from({ length: count }, (_, i) => {
    const nameIndex = Math.floor(Math.random() * names.length);
    const companyIndex = Math.floor(Math.random() * companies.length);
    const name = names[nameIndex];
    const company = companies[companyIndex];
    
    return {
      id: `lead-${String(i + 1).padStart(3, '0')}`,
      name: `${name}`,
      company: `${company}`,
      email: `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      source: sources[Math.floor(Math.random() * sources.length)],
      score: Math.floor(Math.random() * 100) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

// For testing purposes, you can log the generated data
if (typeof window !== 'undefined') {
  (window as { generateTestLeads?: typeof generateTestLeads }).generateTestLeads = generateTestLeads;
}
