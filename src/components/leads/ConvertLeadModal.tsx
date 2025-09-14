import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Lead, Opportunity } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ConvertLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (leadId: string, opportunityData: Omit<Opportunity, 'id' | 'leadId'>) => Promise<void>;
}

export const ConvertLeadModal = ({ lead, isOpen, onClose, onConvert }: ConvertLeadModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    stage: 'prospecting' as Opportunity['stage'],
    amount: '',
    accountName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setLoading(true);
    setError(null);

    try {
      await onConvert(lead.id, {
        name: formData.name || `${lead.name} - ${lead.company}`,
        stage: formData.stage,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        accountName: formData.accountName || lead.company
      });
      
      setFormData({
        name: '',
        stage: 'prospecting',
        amount: '',
        accountName: ''
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lead) {
      setFormData({
        name: `${lead.name} - ${lead.company}`,
        stage: 'prospecting',
        amount: '',
        accountName: lead.company
      });
      setError(null);
    }
  }, [isOpen, lead]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-10 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Convert Lead to Opportunity
                    </Dialog.Title>
                    
                    {error && (
                      <div className="mt-3 rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                      </div>
                    )}
                    
                    <div className="mt-4 space-y-4">
                      <Input
                        label="Opportunity Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Stage</label>
                        <select
                          value={formData.stage}
                          onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as Opportunity['stage'] }))}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        >
                          <option value="prospecting">Prospecting</option>
                          <option value="qualification">Qualification</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="closed-won">Closed Won</option>
                          <option value="closed-lost">Closed Lost</option>
                        </select>
                      </div>
                      
                      <Input
                        label="Amount (Optional)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                      />
                      
                      <Input
                        label="Account Name"
                        value={formData.accountName}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={loading}
                      className="sm:col-start-2"
                    >
                      Convert to Opportunity
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={loading}
                      className="mt-3 sm:col-start-1 sm:mt-0"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
