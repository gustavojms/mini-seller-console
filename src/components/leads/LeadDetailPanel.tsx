import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Lead } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>;
  onConvert: (lead: Lead) => void;
}

export const LeadDetailPanel = ({ 
  lead, 
  isOpen, 
  onClose, 
  onUpdate, 
  onConvert 
}: LeadDetailPanelProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    if (lead) {
      setFormData({ status: lead.status, email: lead.email });
      setEditing(true);
      setError(null);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!lead) return;
    
    // Validate email format
    if (formData.email && !validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      await onUpdate(lead.id, formData);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({});
    setError(null);
  };

  // Reset form when lead changes
  useEffect(() => {
    if (lead && !editing) {
      setFormData({ status: lead.status, email: lead.email });
      setError(null);
    }
  }, [lead, editing]);

  if (!lead) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Lead Details
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                          <div className="text-sm text-red-700">{error}</div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="mt-1 text-sm text-gray-900">{lead.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <p className="mt-1 text-sm text-gray-900">{lead.company}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          {editing ? (
                            <Input
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              className="mt-1"
                              error={error && error.includes('email') ? error : undefined}
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{lead.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          {editing ? (
                            <select
                              value={formData.status || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Lead['status'] }))}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="unqualified">Unqualified</option>
                            </select>
                          ) : (
                            <span className={`mt-1 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {lead.status}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Score</label>
                          <p className="mt-1 text-sm text-gray-900">{lead.score}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Source</label>
                          <p className="mt-1 text-sm text-gray-900">{lead.source}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex space-x-3">
                        {editing ? (
                          <>
                            <Button
                              onClick={handleSave}
                              loading={saving}
                              disabled={saving}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={handleCancel}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={handleEdit}>
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => onConvert(lead)}
                            >
                              Convert to Opportunity
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
