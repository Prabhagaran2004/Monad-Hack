import React, { useState } from "react";

interface LevelCompleteModalProps {
  level: number;
  score: number;
  walletAddress: string | null;
  onContinue: () => void;
  onBackToMenu: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  score,
  walletAddress,
  onContinue,
  onBackToMenu,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const rewards = [
    { level: 1, amount: "10" },
    { level: 2, amount: "20" },
    { level: 3, amount: "30" },
    { level: 4, amount: "50" },
    { level: 5, amount: "100" },
  ];

  const currentReward = rewards.find((r) => r.level === level) || {
    level,
    amount: "10",
  };

  const canClaim = score >= 50;
  const claimReward = async () => {
    if (!canClaim) {
      setErrorMessage("Score must be at least 50 to claim reward.");
      setClaimStatus("error");
      return;
    }
    if (!walletAddress) {
      setErrorMessage("Wallet not connected");
      setClaimStatus("error");
      return;
    }
    setIsClaiming(true);
    setErrorMessage("");

    try {
      // Simulate API call
      const response = await fetch("http://localhost:3001/api/level-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, level, score }),
      });
      // Optimistically show 'success' even if slow
      setClaimStatus("success");
      if (!response.ok) throw new Error("Failed to claim reward");
      await response.json();
    } catch (error) {
      setErrorMessage("Failed to claim reward. Please try again.");
      setClaimStatus("error");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-4xl pixel-font text-white mb-8 text-center">
          LEVEL {level} COMPLETE!
        </h2>

        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center py-3 px-4 bg-[#1A1C2E] rounded-lg border border-[#2D3748]">
            <span className="text-gray-400 font-light">Final Score:</span>
            <span className="text-2xl pixel-font score-display">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-[#1A1C2E] rounded-lg border border-[#2D3748]">
            <span className="text-gray-400 font-light">Reward:</span>
            <span className="text-2xl pixel-font text-[#B07BFF]">
              {currentReward.amount} MNTYPE
            </span>
          </div>
        </div>

        {claimStatus === "idle" && (
          <div className="space-y-4">
            <p className="text-gray-400 text-center font-light">
              Claim your reward to continue to the next level
            </p>

            <button
              onClick={claimReward}
              disabled={isClaiming || !canClaim}
              className="btn-primary w-full"
            >
              {isClaiming
                ? "Claiming..."
                : `Claim ${currentReward.amount} MNTYPE`}
            </button>

            <button onClick={onContinue} className="btn-secondary w-full">
              Skip & Continue
            </button>
          </div>
        )}

        {claimStatus === "success" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4 neon-text">✓</div>
              <p className="text-white font-medium text-lg pixel-font">
                {currentReward.amount} MNTYPE CLAIMED
              </p>
            </div>

            <button onClick={onContinue} className="btn-primary w-full">
              CONTINUE TO LEVEL {level + 1}
            </button>
          </div>
        )}

        {claimStatus === "error" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4 text-[#B07BFF]">×</div>
              <p className="text-red-400">
                {errorMessage || "Something went wrong"}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={claimReward}
                disabled={isClaiming}
                className="btn-primary flex-1"
              >
                TRY AGAIN
              </button>

              <button onClick={onContinue} className="btn-secondary flex-1">
                SKIP & CONTINUE
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onBackToMenu}
          className="w-full text-gray-500 hover:text-gray-400 text-sm mt-6 font-light transition-colors"
        >
          ← BACK TO MENU
        </button>
      </div>
    </div>
  );
};

export default LevelCompleteModal;
