import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E12] to-[#0A0F1F] pixel-font">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-8 p-4 md:p-8">
        {isWalletConnected && <Sidebar />}
        <div className="flex-1 flex flex-col items-center gap-8">
          <Header currentView={currentView} setCurrentView={setCurrentView} />
          <main className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
            {!isWalletConnected ? (
              <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="text-center mb-8">
                  <h1 className="text-6xl pixel-font text-white mb-6">
                    MONAD<span className="text-[#B07BFF]">TYPE</span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 font-light">
                    A pixel-art typing shooter on Monad blockchain
                  </p>
                  <p className="text-gray-400 mb-8 font-light">
                    Connect your wallet to start playing and earning MNTYPE tokens
                  </p>
                </div>
                <WalletConnect onConnect={() => {}} />
              </div>
            ) : (
              <>
                {currentView === "menu" ? (
                  <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="text-center mb-8">
                      <h2 className="text-4xl pixel-font text-white mb-6">
                        READY TO PLAY?
                      </h2>
                      <p className="text-lg text-gray-300 mb-8 font-light">
                        Type falling words to destroy enemies and earn rewards!
                      </p>
                    </div>
                    <div className="flex space-x-4">
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
                    </div>
                  </div>
                ) : currentView === "game" ? (
                  <Game onBackToMenu={() => setCurrentView("menu")} />
                ) : currentView === "levels" ? (
                  <div className="text-center text-white">
                    <h2 className="text-3xl pixel-font mb-6">LEVELS</h2>
                    <p className="text-gray-300">Coming soon...</p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <h2 className="text-3xl pixel-font mb-6">REWARDS</h2>
                    <p className="text-gray-300">Coming soon...</p>
                  </div>
                )}
              </>
            )}
          </main>
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
