import React, { useEffect, useState } from 'react';
import badgesData from './badges.json';

interface Badge {
  badgeId: string;
  badgeName: string;
  type: string;
  order: number;
  description: string;
}

const BadgeModal: React.FC<{ badge: Badge | null; onClose: () => void }> = ({ badge, onClose }) => {
  if (!badge) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <img
          src={`/plugins/badges/images/${badge.badgeId}.png`}
          alt={badge.badgeName}
          className="w-40 h-40 object-contain mx-auto mb-4"
        />
        <div className="text-xl font-bold text-center mb-2">{badge.badgeName}</div>
        <div className="text-gray-700 text-center">{badge.description}</div>
      </div>
    </div>
  );
};

const BadgesGrid: React.FC<{ badges: Badge[]; onBadgeClick: (badge: Badge) => void }> = ({ badges, onBadgeClick }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {badges.map(badge => (
      <div key={badge.badgeId} className="flex flex-col items-center border border-gray-200 rounded-lg bg-white shadow-sm py-4 cursor-pointer" onClick={() => onBadgeClick(badge)}>
        <img
          src={`/plugins/badges/images/${badge.badgeId}.png`}
          alt={badge.badgeName}
          title={badge.description}
          className="w-20 h-20 object-contain mb-2"
        />
        <div className="text-center text-sm font-semibold mt-1">{badge.badgeName}</div>
      </div>
    ))}
  </div>
);

const BadgesPage: React.FC = () => {
  const [individualBadges, setIndividualBadges] = useState<Badge[]>([]);
  const [teamBadges, setTeamBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

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
        <BadgesGrid badges={individualBadges} onBadgeClick={setSelectedBadge} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <BadgesGrid badges={teamBadges} onBadgeClick={setSelectedBadge} />
      </div>
      <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
};

export default BadgesPage; 