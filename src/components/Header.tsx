import React from "react";
import { useWallet } from "../contexts/WalletContext.tsx";

interface HeaderProps {
  currentView: "menu" | "game" | "levels" | "rewards";
  setCurrentView: (view: "menu" | "game" | "levels" | "rewards") => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { wallet, disconnectWallet, switchNetwork } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems = [
    { id: "menu", label: "Home" },
    { id: "levels", label: "Levels" },
    { id: "rewards", label: "Rewards" },
  ];

  return (
    <header className="navbar pixel-font w-full bg-[#1a1c2e] border-b-2 border-[#38e8f8] rounded-lg shadow px-6 py-3 flex items-center justify-between mt-4 md:mt-0">
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl pixel-font text-white">
          MONAD<span className="text-[#B07BFF]">TYPE</span>
        </h1>

        {wallet.isConnected && (
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? "text-[#38E8F8] neon-text"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {wallet.isConnected ? (
          <>
            <div className="hidden md:flex items-center space-x-2 bg-[#1A1C2E] px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#6FFFB0] animate-pulse" />
              <span className="text-xs text-gray-300">Connected</span>
            </div>

            <div className="text-white hidden md:block">
              <span className="text-xs text-gray-400">Balance: </span>
              <span className="font-mono text-sm font-medium text-[#6FFFB0]">
                {parseFloat(wallet.tokenBalance).toFixed(2)} MNTYPE
              </span>
            </div>

            <div className="text-white hidden md:block">
              <span className="text-xs text-gray-400">Network: </span>
              <span
                className={`font-mono text-xs ${
                  wallet.isCorrectNetwork ? "text-[#6FFFB0]" : "text-red-400"
                }`}
              >
                {wallet.isCorrectNetwork ? "Monad Testnet" : "Wrong Network"}
              </span>
            </div>

            <div className="text-white font-mono text-xs bg-[#1A1C2E] px-2 py-1 rounded border border-[#2D3748] hidden md:block">
              {formatAddress(wallet.address!)}
            </div>

            <div className="flex space-x-2">
              {!wallet.isCorrectNetwork && (
                <button
                  onClick={switchNetwork}
                  className="wallet-button text-xs px-3 py-1.5"
                >
                  Switch
                </button>
              )}

              <button
                onClick={disconnectWallet}
                className="wallet-button connected text-xs px-3 py-1.5"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-xs font-light">
            Wallet not connected
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
