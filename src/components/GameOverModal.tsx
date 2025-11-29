import React from "react";

interface GameOverModalProps {
  score: number;
  level: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  level,
  onRestart,
  onBackToMenu,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-4xl pixel-font text-red-400 mb-8 text-center neon-text">
          GAME OVER
        </h2>

        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center py-3 px-4 bg-[#1A1C2E] rounded-lg border border-[#2D3748]">
            <span className="text-gray-400 font-light">Final Score:</span>
            <span className="text-2xl pixel-font score-display">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-[#1A1C2E] rounded-lg border border-[#2D3748]">
            <span className="text-gray-400 font-light">Level Reached:</span>
            <span className="text-2xl pixel-font level-display">{level}</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-400 font-light">
            Better luck next time! Practice your typing and try again.
          </p>
        </div>

        <div className="space-y-4">
          <button onClick={onRestart} className="btn-primary w-full">
            PLAY AGAIN
          </button>

          <button onClick={onBackToMenu} className="btn-secondary w-full">
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
