import React from 'react';
import { Sparkles } from 'lucide-react';

const Logo = () => (
  <div className="flex items-center">
    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-800 text-white">
      <Sparkles size={18} />
    </div>
    <span className="ml-2 font-semibold text-lg text-purple-900">Alice | CodeItForward</span>
  </div>
);

const colorScheme = {
  primary: '#6D28D9', // purple-800
  secondary: '#A78BFA', // purple-400
};

const theme = {
  siteTitle: 'Alice | CodeItForward',
  Logo,
  colorScheme,
};

export default theme; 