import React from 'react';

const CreativeCodersPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Creative Coders</h1>
      <p>Welcome to the Creative Coders plugin! This page is only visible to users with the <span className="font-mono">creative-coders</span> role.</p>
    </div>
  );
};

export default CreativeCodersPage; 