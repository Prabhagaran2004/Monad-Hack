import React, { useState } from "react";
import { WalletProvider, useWallet } from "./contexts/WalletContext.tsx";
import { GameProvider } from "./contexts/GameContext.tsx";
import WalletConnect from "./components/WalletConnect.tsx";
import Game from "./components/Game.tsx";
import Header from "./components/Header.tsx";
import Sidebar from "./components/Sidebar.tsx";

function AppContent() {
  const [currentView, setCurrentView] = useState<
    "menu" | "game" | "levels" | "rewards"
  >("menu");
  const { wallet } = useWallet();
  const isWalletConnected = wallet.isConnected;

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <main className="flex-1">
            {!isWalletConnected ? (
              <section className="flex flex-col items-center text-center gap-8">
                <div>
                  <h1 className="text-5xl sm:text-6xl pixel-font text-white mb-6">
                    MONAD<span className="text-[#B07BFF]">TYPE</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-300 mb-4 font-light max-w-2xl">
                    A pixel-art typing shooter built on the Monad blockchain.
                  </p>
                  <p className="text-gray-400 font-light max-w-xl">
                    Connect your wallet to unlock levels, earn rewards, and
                    compete on the leaderboard.
                  </p>
                </div>
                <WalletConnect onConnect={() => {}} />
              </section>
            ) : currentView === "menu" ? (
              <section className="flex flex-col items-center text-center gap-8">
                <div>
                  <h2 className="text-4xl pixel-font text-white mb-4">
                    Ready to play?
                  </h2>
                  <p className="text-lg text-gray-300 font-light max-w-2xl">
                    Type the falling words before they land. Keep your accuracy
                    high to boost your combo and claim more rewards.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setCurrentView("game")}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Start Game
                  </button>
                  <button
                    onClick={() => setCurrentView("levels")}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Levels
                  </button>
                  <button
                    onClick={() => setCurrentView("rewards")}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Rewards
                  </button>
                </div>
              </section>
            ) : currentView === "game" ? (
              <Game onBackToMenu={() => setCurrentView("menu")} />
            ) : currentView === "levels" ? (
              <section className="text-center space-y-4">
                <h2 className="text-3xl pixel-font">Levels</h2>
                <p className="text-gray-300">
                  Progressive difficulty tiers coming soon.
                </p>
              </section>
            ) : (
              <section className="text-center space-y-4">
                <h2 className="text-3xl pixel-font">Rewards</h2>
                <p className="text-gray-300">
                  Track your earnings and claim bonuses soon.
                </p>
              </section>
            )}
          </main>

          {isWalletConnected && (
            <aside className="w-full lg:w-80 flex-shrink-0">
              <Sidebar />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </WalletProvider>
  );
}

export default App;
