import React from 'react';
import { Sparkles } from 'lucide-react';

const Logo = () => (
  <div className="flex items-center">
    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-800 text-white">
      <Sparkles size={18} />
    </div>
    <span className="ml-2 font-semibold text-lg text-purple-900">Alice 
      <span style={{ color: '#e67c18' }}> [</span>
      <span style={{ color: '#22292f' }}>Code</span>
      <span style={{ color: '#e67c18' }}>]</span>
      <span style={{ color: '#32b6ae' }}>it</span>
      <span style={{ color: '#e67c18' }}>&gt;</span>
      <span style={{ color: '#22292f' }}>Forward</span>
    </span>
  </div>
);

const colorScheme = {
  primary: '#6D28D9', // purple-800
  secondary: '#A78BFA', // purple-400
};

const theme = {
  siteTitle: 'Alice [Code] It > Forward',
  Logo,
  colorScheme,
};

export default theme; 