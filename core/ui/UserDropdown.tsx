import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Moon } from 'lucide-react';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-sm font-medium text-purple-800">DS</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all duration-200 ease-in-out">
          <div className="py-2 border-b border-gray-100">
            <div className="px-4 py-2">
              <p className="text-sm font-medium">Dr. Smith</p>
              <p className="text-xs text-gray-500">david.smith@nyu.edu</p>
            </div>
          </div>
          
          <div className="py-1">
            <DropdownItem icon={<User size={16} />} label="Profile" />
            <DropdownItem icon={<Settings size={16} />} label="Settings" />
            <DropdownItem icon={<Moon size={16} />} label="Dark Mode" />
          </div>
          
          <div className="py-1 border-t border-gray-100">
            <DropdownItem icon={<LogOut size={16} />} label="Sign out" />
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon, label }) => {
  return (
    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
      <span className="mr-2 text-gray-500">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default UserDropdown;