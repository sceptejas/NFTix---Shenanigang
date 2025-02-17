import { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  provider: null,
  signer: null,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await newProvider.getSigner();
          setAccount(accounts[0]);
          setProvider(newProvider);
          setSigner(newSigner);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this feature!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();
      
      setAccount(accounts[0]);
      setProvider(newProvider);
      setSigner(newSigner);
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.');
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, provider, signer }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);