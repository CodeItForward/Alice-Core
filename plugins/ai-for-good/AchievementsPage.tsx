import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import badgesData from '../badges/badges.json';

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

const AchievementsPage: React.FC = () => {
  const { user } = useUser();
  let achievements = user?.publicMetadata?.achievements || [];
  if (typeof achievements === 'string') {
    try {
      const parsed = JSON.parse(achievements);
      achievements = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      achievements = [achievements];
    }
  }
  const earnedBadges = (badgesData as Badge[]).filter(badge => Array.isArray(achievements) && achievements.includes(badge.badgeId));
  const individualBadges = earnedBadges.filter(b => b.type === 'Individual');
  const teamBadges = earnedBadges.filter(b => b.type === 'Team');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      <p className="mb-6 text-lg text-green-700 font-semibold">Congratulations! Below are your achievement badges for the project!</p>
      {earnedBadges.length === 0 ? (
        <p>You haven't earned any badges yet.</p>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Individual Achievements</h2>
            {individualBadges.length === 0 ? <p className="text-gray-500 mb-4">No individual achievements yet.</p> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {individualBadges.map(badge => (
                  <div key={badge.badgeId} className="flex flex-col items-center border border-gray-200 rounded-lg bg-white shadow-sm py-4 cursor-pointer" onClick={() => setSelectedBadge(badge)}>
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
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Team Achievements</h2>
            {teamBadges.length === 0 ? <p className="text-gray-500 mb-4">No team achievements yet.</p> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {teamBadges.map(badge => (
                  <div key={badge.badgeId} className="flex flex-col items-center border border-gray-200 rounded-lg bg-white shadow-sm py-4 cursor-pointer" onClick={() => setSelectedBadge(badge)}>
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
            )}
          </div>
          <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
        </>
      )}
    </div>
  );
};

export default AchievementsPage; 