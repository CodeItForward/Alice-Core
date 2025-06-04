import React, { useEffect, useState } from 'react';
import badgesData from './badges.json';

interface Badge {
  badgeId: string;
  badgeName: string;
  type: string;
  order: number;
  description: string;
}

const BadgesGrid: React.FC<{ badges: Badge[] }> = ({ badges }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {badges.map(badge => (
      <div key={badge.badgeId} className="flex flex-col items-center border border-gray-200 rounded-lg bg-white shadow-sm py-4">
        <img
          src={`/plugins/badges/images/${badge.badgeId}.png`}
          alt={badge.badgeName}
          title={badge.description}
          className="w-20 h-20 object-contain mb-2 cursor-pointer"
        />
        <div className="text-center text-sm font-semibold mt-1">{badge.badgeName}</div>
      </div>
    ))}
  </div>
);

const BadgesPage: React.FC = () => {
  const [individualBadges, setIndividualBadges] = useState<Badge[]>([]);
  const [teamBadges, setTeamBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const sorted = (badgesData as Badge[]).sort((a, b) => a.order - b.order);
    setIndividualBadges(sorted.filter(b => b.type === 'Individual'));
    setTeamBadges(sorted.filter(b => b.type === 'Team'));
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50 p-6 overflow-auto" style={{ height: '100%' }}>
      <h1 className="text-2xl font-bold mb-6">Badges</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Individual</h2>
        <BadgesGrid badges={individualBadges} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <BadgesGrid badges={teamBadges} />
      </div>
    </div>
  );
};

export default BadgesPage; 