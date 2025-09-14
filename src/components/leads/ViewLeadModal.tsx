import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, EnvelopeIcon, BuildingOfficeIcon, StarIcon } from '@heroicons/react/24/outline';
import type { Lead } from '../../types';
import { Button } from '../ui/Button';

interface ViewLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onConvert: () => void;
}

export const ViewLeadModal: React.FC<ViewLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onConvert,
}) => {
  if (!lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'converted': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
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
                    Lead Details
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{lead.name}</h4>
                      <div className="flex items-center text-gray-600 mt-1">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        {lead.company}
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center text-gray-700">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <StarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Score: <span className="font-medium ml-1">{lead.score}/100</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Source:</span> {lead.source}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Lead Score</span>
                      <span>{lead.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          lead.score >= 80 ? 'bg-green-500' :
                          lead.score >= 60 ? 'bg-yellow-500' :
                          lead.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button variant="secondary" onClick={onClose}>
                      Close
                    </Button>
                    {lead.status !== 'converted' && (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            onClose();
                            onEdit();
                          }}
                        >
                          Edit Lead
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            onClose();
                            onConvert();
                          }}
                        >
                          Convert to Opportunity
                        </Button>
                      </>
                    )}
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
