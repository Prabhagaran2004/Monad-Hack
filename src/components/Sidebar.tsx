import React from "react";
import { useWallet } from "../contexts/WalletContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

const Sidebar: React.FC = () => {
  const { wallet } = useWallet();
  const { gameState } = useGame();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const levelRewards = [
    { level: 1, reward: "10" },
    { level: 2, reward: "20" },
    { level: 3, reward: "30" },
    { level: 4, reward: "50" },
    { level: 5, reward: "100" },
  ];

  const currentReward = levelRewards.find(
    (r) => r.level === gameState.level
  ) || {
    level: gameState.level,
    reward: "10",
  };

  // Calculate mock stats for display
  const mockStats = {
    wordsPerMinute: 42,
    accuracy: 92,
    streak: 15,
  };

  const progressToNextLevel = ((gameState.score % 1000) / 1000) * 100;

  return (
    <aside className="sidebar pixel-font max-w-xs w-full bg-[#161625] border-2 border-[#B07BFF] rounded-lg shadow-xl gap-6 p-6 flex flex-col items-stretch mt-4 md:mt-0">
      <div className="space-y-6">
        {/* Wallet Info */}
        <div className="stat-card">
          <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Wallet
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#6FFFB0] animate-pulse" />
            <p className="text-[#B07BFF] font-mono text-sm">
              {formatAddress(wallet.address!)}
            </p>
          </div>
        </div>

        {/* Balance */}
        <div className="stat-card">
          <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Balance
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {parseFloat(wallet.tokenBalance).toFixed(1)}
            </span>
            <span className="text-[#6FFFB0] font-bold text-sm">MNTYPE</span>
          </div>
        </div>

        {/* Current Level */}
        <div className="stat-card">
          <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Current Level
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl pixel-font text-white">
              {gameState.level}
            </span>
            <span className="text-[#FFA64D] font-bold text-sm">
              {currentReward.reward} MNTYPE
            </span>
          </div>
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: `${progressToNextLevel}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {progressToNextLevel.toFixed(0)}% to next level
          </p>
        </div>

        {/* Game Stats */}
        <div className="stat-card">
          <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">
            Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">WPM</span>
                <span className="text-white font-bold text-sm">
                  {mockStats.wordsPerMinute}
                </span>
              </div>
              <div className="progress-bar h-1.5">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      (mockStats.wordsPerMinute / 100) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Accuracy</span>
                <span className="text-white font-bold text-sm">
                  {mockStats.accuracy}%
                </span>
              </div>
              <div className="progress-bar h-1.5">
                <div
                  className="progress-fill"
                  style={{ width: `${mockStats.accuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Streak</span>
              <span className="text-[#FFA64D] font-bold text-sm">
                {mockStats.streak}x
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Score</span>
              <span className="text-[#38E8F8] font-bold text-sm score-display">
                {gameState.score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="stat-card">
          <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full btn-primary text-xs py-2" disabled={gameState.score < 50}>
              Claim Rewards
            </button>
            <button className="w-full btn-secondary text-xs py-2">
              View History
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
