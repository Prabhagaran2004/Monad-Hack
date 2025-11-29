import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext.tsx";

interface WalletConnectProps {
  onConnect: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const { connectWallet, switchNetwork } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await connectWallet();

      if (result.success) {
        onConnect();
      } else {
        setError(result.error || "Failed to connect wallet");
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      const result = await switchNetwork();
      if (!result.success) {
        setError(result.error || "Failed to switch network");
      }
    } catch (err) {
      setError("Network switch failed");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="wallet-button text-lg px-10 py-5 min-w-[280px]"
      >
        {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
      </button>

      {error && (
        <div className="text-red-400 text-sm text-center max-w-md bg-red-900/20 px-4 py-3 rounded-lg border border-red-900/30">
          {error}
        </div>
      )}

      <div className="text-gray-500 text-sm text-center max-w-md space-y-2 font-light">
        <p>Make sure you have MetaMask installed.</p>
        <p>The game will automatically connect to Monad Testnet.</p>
      </div>

      <div className="text-gray-600 text-xs text-center font-light">
        <p>Don't have a wallet? Get MetaMask from metamask.io</p>
      </div>
    </div>
  );
};

export default WalletConnect;
