import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import type { Opportunity } from '../../types';
import { Button } from '../ui/Button';

interface ViewOpportunityModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const ViewOpportunityModal: React.FC<ViewOpportunityModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!opportunity) return null;

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualification': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed-won': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed-lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-10" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                    Opportunity Details
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{opportunity.name}</h4>
                      <div className="flex items-center text-gray-600 mt-1">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        {opportunity.accountName}
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStageColor(opportunity.stage)}`}>
                      {opportunity.stage.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center text-gray-700">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Amount: </span>
                      <span className="ml-1">
                        {opportunity.amount ? `$${opportunity.amount.toLocaleString()}` : 'Not specified'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Lead ID:</span> {opportunity.leadId}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button variant="secondary" onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        onClose();
                        onEdit();
                      }}
                    >
                      Edit Opportunity
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
