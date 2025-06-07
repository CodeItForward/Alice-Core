import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClerk } from '@clerk/clerk-react';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, userInfo, signOut } = useAuth();
  const { signOut: clerkSignOut } = useClerk();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await clerkSignOut();
    signOut();
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-sm font-medium text-purple-800">
            {userInfo?.display_name ? getInitials(userInfo.display_name) : 'U'}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all duration-200 ease-in-out">
          <div className="py-2 border-b border-gray-100">
            <div className="px-4 py-2">
              <p className="text-sm font-medium">{userInfo?.display_name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="py-1">
            <DropdownItem icon={<User size={16} />} label="Profile" />
            <DropdownItem icon={<Settings size={16} />} label="Settings" />
            <DropdownItem icon={<Moon size={16} />} label="Dark Mode" />
          </div>
          
          <div className="py-1 border-t border-gray-100">
            <DropdownItem icon={<LogOut size={16} />} label="Sign out" onClick={handleSignOut} />
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

export default UserDropdown;