import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export interface DropdownAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  actions: DropdownAction[];
  buttonClassName?: string;
}

export const Dropdown = ({ 
  actions, 
  buttonClassName = "p-1 text-gray-400 hover:text-gray-600 transition-colors" 
}: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={buttonClassName}>
        <EllipsisVerticalIcon className="h-5 w-5" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 
                      action.variant === 'danger' ? 'text-red-700' : 'text-gray-700'
                    } group flex w-full items-center px-4 py-2 text-sm hover:${
                      action.variant === 'danger' ? 'bg-red-50' : 'bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 h-4 w-4 flex items-center justify-center">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
