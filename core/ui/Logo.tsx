import React from 'react';
import { Sparkles } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-800 text-white">
        <Sparkles size={18} />
      </div>
      <span className="ml-2 font-semibold text-lg text-purple-900">NYU Alice</span>
    </div>
  );
};