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

  const navItems: Array<{ id: HeaderProps["currentView"]; label: string }> = [
    { id: "menu", label: "Home" },
    { id: "levels", label: "Levels" },
    { id: "rewards", label: "Rewards" },
  ];

  return (
    <header className="bg-[#101225] border-b border-[#2D3748]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-2xl pixel-font text-white">
            MONAD<span className="text-[#B07BFF]">TYPE</span>
          </h1>

          {wallet.isConnected && (
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`text-sm uppercase tracking-wide transition-colors ${
                    currentView === item.id
                      ? "text-[#B07BFF]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          {wallet.isConnected ? (
            <>
              <div className="flex items-center gap-2 bg-[#1A1C2E] border border-[#2D3748] rounded-md px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-[#B07BFF] animate-pulse" />
                <span className="text-gray-300">Connected</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-gray-300">
                <span>Balance:</span>
                <span className="font-mono text-[#B07BFF]">
                  {parseFloat(wallet.tokenBalance || "0").toFixed(2)} MNTYPE
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-gray-300">
                <span>Network:</span>
                <span
                  className={
                    wallet.isCorrectNetwork ? "text-[#B07BFF]" : "text-red-400"
                  }
                >
                  {wallet.isCorrectNetwork ? "Monad Testnet" : "Wrong network"}
                </span>
              </div>

              {wallet.address && (
                <span className="hidden sm:inline-flex font-mono bg-[#1A1C2E] border border-[#2D3748] rounded-md px-3 py-1">
                  {formatAddress(wallet.address)}
                </span>
              )}

              <div className="flex items-center gap-2">
                {!wallet.isCorrectNetwork && (
                  <button
                    onClick={switchNetwork}
                    className="wallet-button text-xs px-3 py-2"
                  >
                    Switch Network
                  </button>
                )}
                <button
                  onClick={disconnectWallet}
                  className="wallet-button text-xs px-3 py-2"
                >
                  Disconnect
                </button>
              </div>
            </>
          ) : (
            <span className="text-gray-400">
              Connect your wallet to get started
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
