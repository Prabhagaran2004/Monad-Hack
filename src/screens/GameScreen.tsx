import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext.tsx";
import { useWallet } from "../contexts/WalletContext.tsx";
import GameCanvas from "../components/GameCanvas.tsx";
import LevelCompleteModal from "../components/LevelCompleteModal.tsx";
import GameOverModal from "../components/GameOverModal.tsx";

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
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

  const handleStartGame = useCallback(() => {
    resetGame();
    startGame();
    setShowLevelComplete(false);
    setShowGameOver(false);
  }, [resetGame, startGame]);

  useEffect(() => {
    handleStartGame();

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [handleStartGame]);

  useEffect(() => {
    if (gameState.levelComplete) {
      setShowLevelComplete(true);
      pauseGame();
    }
  }, [gameState.levelComplete, pauseGame]);

  useEffect(() => {
    if (gameState.gameOver) {
      setShowGameOver(true);
    }
  }, [gameState.gameOver]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoopRef.current = setInterval(() => {
        updateEnemies();
      }, 50);

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, updateEnemies]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const spawnDelay = Math.max(1000, 3000 - gameState.level * 200);

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

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.level,
    gameState.enemies.length,
    spawnEnemy,
  ]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!gameState.isPlaying || gameState.isPaused) {
      return;
    }

    const newValue = event.target.value.toLowerCase();
    updateInput(newValue);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (gameState.isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
      return;
    }

    if (!gameState.isPlaying && event.key === "Enter") {
      event.preventDefault();
      handleStartGame();
    }
  };

  const handleContinueLevel = () => {
    setShowLevelComplete(false);
    nextLevel();
  };

  const handleRestart = () => {
    setShowGameOver(false);
    handleStartGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    navigate("/");
  };

  const handlePauseToggle = () => {
    if (!gameState.isPlaying) {
      return;
    }

    if (gameState.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const livesDisplay = Array.from({ length: 3 }, (_, index) =>
    index < gameState.lives ? "❤" : "♡"
  ).join(" ");
  const progressToNextLevel = Math.min(
    ((gameState.score % 1000) / 1000) * 100,
    100
  );
  const comboMultiplier = Math.floor(gameState.score / 100);
  const estimatedWpm = Math.max(0, Math.round(gameState.score / 5));
  const accuracy = Math.min(
    100,
    Math.max(40, 80 + gameState.lives * 6 - gameState.enemies.length)
  );

  return (
    <div
      className="subtle-grid"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header className="hud-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn-ghost" onClick={handleBackToMenu}>
            ◀ Back
          </button>
          <div>
            <div className="hud-label">Level</div>
            <div className="hud-value">{gameState.level}</div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="hud-label">Lives</div>
          <div className="mono-font" style={{ fontSize: 22 }}>
            {livesDisplay}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="hud-label">Score</div>
          <div className="hud-value mono-font">
            {gameState.score.toLocaleString()}
          </div>
        </div>
      </header>

      <div className="app-section" style={{ paddingTop: 16 }}>
        <div className="page-container">
          <div className="wallet-bar">
            <div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Address
              </div>
              <div className="mono-font" style={{ fontSize: 16 }}>
                {wallet.address
                  ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(
                      -4
                    )}`
                  : "0x0000...0000"}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  color: "var(--text-secondary)",
                }}
              >
                Balance:{" "}
                <span style={{ color: "var(--accent-purple)" }}>
                  {parseFloat(wallet.tokenBalance || "0").toFixed(2)} MNTYPE
                </span>
              </div>
            </div>
            <button
              className="btn-ghost"
              style={{
                borderColor: "var(--accent-purple)",
                color: "var(--accent-purple)",
                minWidth: 140,
              }}
              onClick={handlePauseToggle}
            >
              {gameState.isPaused ? "Resume ▶" : "Pause ⏸"}
            </button>
          </div>
        </div>
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "32px 32px 0",
        }}
      >
        <div
          className="page-container"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              height: "100%",
              maxHeight: 540,
              borderRadius: 12,
              border: "2px solid var(--border-color)",
              background: "var(--bg-primary)",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <GameCanvas />

            {!gameState.isPlaying && !showLevelComplete && !showGameOver && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(10,14,39,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="card"
                  style={{ maxWidth: 320, textAlign: "center" }}
                >
                  <h3
                    className="pixel-font"
                    style={{ fontSize: 20, marginBottom: 12 }}
                  >
                    Standby
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    Tap "Restart Mission" below to redeploy your ship.
                  </p>
                </div>
              </div>
            )}

            {gameState.isPaused && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(10,14,39,0.85)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="card"
                  style={{ maxWidth: 320, textAlign: "center" }}
                >
                  <h3
                    className="pixel-font"
                    style={{ fontSize: 24, marginBottom: 16 }}
                  >
                    Game Paused
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <button className="btn-primary" onClick={resumeGame}>
                      Resume
                    </button>
                    <button className="btn-secondary" onClick={handleRestart}>
                      Restart Mission
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={handleBackToMenu}
                    >
                      Back to Menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer
        style={{
          background: "var(--bg-secondary)",
          borderTop: "2px solid var(--accent-purple)",
          padding: "24px 32px",
        }}
      >
        <div
          className="page-container"
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              className="game-input"
              placeholder="Type to shoot..."
              value={gameState.currentInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              autoFocus
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 16 }}>
              <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>
                Combo
              </span>
              <span
                style={{
                  color:
                    comboMultiplier >= 6
                      ? "var(--success)"
                      : comboMultiplier >= 3
                      ? "var(--warning)"
                      : "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                x{comboMultiplier}
              </span>
            </div>
            <div style={{ fontSize: 16 }}>
              <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>
                WPM
              </span>
              <span className="mono-font" style={{ fontSize: 18 }}>
                {estimatedWpm}
              </span>
            </div>
            <div style={{ fontSize: 16 }}>
              <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>
                Accuracy
              </span>
              <span
                style={{
                  color:
                    accuracy >= 80
                      ? "var(--success)"
                      : accuracy >= 60
                      ? "var(--warning)"
                      : "var(--error)",
                  fontWeight: 600,
                }}
              >
                {accuracy}%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                Progress
              </span>
              <div
                style={{
                  width: 200,
                  height: 20,
                  background: "var(--border-color)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressToNextLevel}%`,
                    height: "100%",
                    background: "var(--accent-purple)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showLevelComplete && (
        <LevelCompleteModal
          level={gameState.level}
          score={gameState.score}
          walletAddress={wallet.address}
          onContinue={handleContinueLevel}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {showGameOver && (
        <GameOverModal
          score={gameState.score}
          level={gameState.level}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default GameScreen;
