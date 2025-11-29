import React from "react";
import { useGame } from "../contexts/GameContext.tsx";
import { useWallet } from "../contexts/WalletContext.tsx";

const GameHUD: React.FC = () => {
  const { gameState } = useGame();
  const { wallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="hud w-full">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="stat-card">
          <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
            Level
          </div>
          <div className="text-2xl pixel-font level-display">
            {gameState.level}
          </div>
        </div>

        <div className="stat-card">
          <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
            Score
          </div>
          <div className="text-2xl pixel-font score-display">
            {gameState.score.toLocaleString()}
          </div>
        </div>

        <div className="stat-card">
          <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
            Lives
          </div>
          <div className="text-2xl font-bold text-[#B07BFF]">
            {"💜".repeat(gameState.lives)}
          </div>
        </div>

        <div className="stat-card">
          <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
            Enemies
          </div>
          <div className="text-2xl pixel-font text-[#B07BFF]">
            {gameState.enemies.length}
          </div>
        </div>

        <div className="stat-card">
          <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
            Balance
          </div>
          <div className="text-lg pixel-font text-[#B07BFF]">
            {parseFloat(wallet.tokenBalance).toFixed(1)} MNTYPE
          </div>
        </div>
      </div>

      {wallet.address && (
        <div className="mt-4 pt-4 border-t border-[#2D3748] text-center">
          <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
            Player
          </div>
          <div className="font-mono text-sm text-[#B07BFF]">
            {formatAddress(wallet.address)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
