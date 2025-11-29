import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "../contexts/GameContext.tsx";
import { useWallet } from "../contexts/WalletContext.tsx";
import GameCanvas from "./GameCanvas.tsx";
import GameHUD from "./GameHUD.tsx";
import LevelCompleteModal from "./LevelCompleteModal.tsx";
import GameOverModal from "./GameOverModal.tsx";

interface GameProps {
  onBackToMenu: () => void;
}

const Game: React.FC<GameProps> = ({ onBackToMenu }) => {
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    updateInput,
    spawnEnemy,
    updateEnemies,
    nextLevel,
  } = useGame();
  const { wallet } = useWallet();
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle game state changes
  useEffect(() => {
    if (gameState.levelComplete && !showLevelComplete) {
      setShowLevelComplete(true);
      pauseGame();
    }
  }, [gameState.levelComplete, showLevelComplete, pauseGame]);

  useEffect(() => {
    if (gameState.gameOver && !showGameOver) {
      setShowGameOver(true);
    }
  }, [gameState.gameOver, showGameOver]);

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoopRef.current = setInterval(() => {
        updateEnemies();
      }, 50); // 20 FPS

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState.isPlaying, gameState.isPaused, updateEnemies]);

  // Enemy spawning
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const spawnDelay = Math.max(1000, 3000 - gameState.level * 200); // Faster spawning at higher levels

      spawnTimerRef.current = setInterval(() => {
        if (gameState.enemies.length < 5 + gameState.level) {
          spawnEnemy();
        }
      }, spawnDelay);

      return () => {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
        }
      };
    }
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.level,
    gameState.enemies.length,
    spawnEnemy,
  ]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return;

      if (e.key === "Escape") {
        if (gameState.isPaused) {
          resumeGame();
        } else {
          pauseGame();
        }
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        updateInput(gameState.currentInput.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        const newInput = gameState.currentInput + e.key.toLowerCase();
        updateInput(newInput);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.currentInput,
    updateInput,
    pauseGame,
    resumeGame,
  ]);

  const handleContinueGame = () => {
    setShowLevelComplete(false);
    nextLevel();
  };

  const handleRestartGame = () => {
    setShowGameOver(false);
    resetGame();
    startGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    onBackToMenu();
  };

  if (!gameState.isPlaying && !gameState.levelComplete && !gameState.gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Get Ready!</h2>
          <p className="text-lg text-gray-300 mb-8">
            Type the words on falling enemies to destroy them!
          </p>
          <div className="text-gray-400 text-left max-w-md mx-auto space-y-2">
            <p>• Type complete words to destroy enemies</p>
            <p>• Don't let enemies reach the bottom</p>
            <p>• Complete levels to earn MNTYPE tokens</p>
            <p>• Press ESC to pause the game</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button onClick={startGame} className="btn-primary text-xl px-8 py-4">
            Start Game
          </button>
          <button
            onClick={handleBackToMenu}
            className="btn-primary text-xl px-8 py-4"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-4xl">
        <GameHUD />
      </div>

      <div className="relative w-full max-w-4xl">
        <GameCanvas activeEnemyId={gameState.activeEnemyId} />

        {gameState.isPaused && (
          <div className="absolute inset-0 bg-[#0A0F1F] bg-opacity-90 flex items-center justify-center rounded-lg backdrop-filter backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-3xl pixel-font text-white mb-4 neon-text">
                PAUSED
              </h3>
              <p className="text-gray-300 mb-6">Press ESC to resume</p>
              <button onClick={resumeGame} className="btn-primary">
                Resume Game
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button onClick={handleBackToMenu} className="btn-secondary">
          Back to Menu
        </button>
      </div>

      {showLevelComplete && (
        <LevelCompleteModal
          level={gameState.level}
          score={gameState.score}
          walletAddress={wallet.address}
          onContinue={handleContinueGame}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {showGameOver && (
        <GameOverModal
          score={gameState.score}
          level={gameState.level}
          onRestart={handleRestartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default Game;
