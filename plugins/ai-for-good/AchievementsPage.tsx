import React from 'react';
import { useUser } from '@clerk/clerk-react';
import badgesData from '../badges/badges.json';

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
  const earnedBadges = badgesData.filter(badge => Array.isArray(achievements) && achievements.includes(badge.badgeId));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      {earnedBadges.length === 0 ? (
        <p>You haven't earned any badges yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {earnedBadges.map(badge => (
            <div key={badge.badgeId} className="flex flex-col items-center border border-gray-200 rounded-lg bg-white shadow-sm py-4">
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
  );
};

export default AchievementsPage; 