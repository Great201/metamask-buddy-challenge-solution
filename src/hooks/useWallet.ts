import { useState, useCallback, useEffect } from 'react';
import { WalletState } from '@/types/wallet';

// Chain ID to name mapping
const CHAIN_NAMES: Record<string, string> = {
  '0x1': 'Ethereum Mainnet',
  '0x89': 'Polygon Mainnet',
  '0xa': 'Optimism Mainnet',
  '0xa4b1': 'Arbitrum One',
  '0x38': 'BNB Smart Chain',
};

// Network configuration for switching
export const NETWORKS = [
  {
    chainId: '0x1',
    name: 'Ethereum',
    fullName: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    currency: 'ETH',
    testnet: false,
  },
  {
    chainId: '0x89',
    name: 'Polygon',
    fullName: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    currency: 'MATIC',
    testnet: false,
  },
  {
    chainId: '0xa',
    name: 'Optimism',
    fullName: 'Optimism Mainnet',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    currency: 'ETH',
    testnet: false,
  },
  {
    chainId: '0xa4b1',
    name: 'Arbitrum',
    fullName: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    currency: 'ETH',
    testnet: false,
  },
  {
    chainId: '0x38',
    name: 'BSC',
    fullName: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    currency: 'BNB',
    testnet: false,
  },
];

// Format address to show first 6 and last 4 characters
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get chain name from chain ID
export const getChainName = (chainId: string): string => {
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
};

// Convert wei to ETH
export const weiToEth = (wei: string): string => {
  const eth = parseInt(wei, 16) / Math.pow(10, 18);
  return eth.toFixed(4);
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    chainId: null,
    balance: null,
  });

  // Check if MetaMask is installed
  const isMetamaskInstalled = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

  // Get wallet balance
  const getBalance = useCallback(async (address: string) => {
    if (!isMetamaskInstalled) return;
    
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      setWalletState(prev => ({
        ...prev,
        balance: weiToEth(balance),
      }));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to fetch balance',
      }));
    }
  }, [isMetamaskInstalled]);

  // Get chain ID
  const getChainId = useCallback(async () => {
    if (!isMetamaskInstalled) return;
    
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      
      setWalletState(prev => ({
        ...prev,
        chainId,
      }));
    } catch (error) {
      console.error('Error fetching chain ID:', error);
    }
  }, [isMetamaskInstalled]);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: string) => {
    if (!isMetamaskInstalled) return;
    
    try {
      setWalletState(prev => ({
        ...prev,
        error: null,
      }));

      // Try to switch to the target network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
      
      // Update chain ID and refresh balance
      setWalletState(prev => ({
        ...prev,
        chainId: targetChainId,
      }));
      
      if (walletState.address) {
        getBalance(walletState.address);
      }
      
    } catch (error: any) {
      console.error('Network switch error:', error);
      
      // If the network is not added to MetaMask, add it
      if (error.code === 4902) {
        try {
          const network = NETWORKS.find(n => n.chainId === targetChainId);
          if (network) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetChainId,
                chainName: network.fullName,
                nativeCurrency: {
                  name: network.currency,
                  symbol: network.currency,
                  decimals: 18,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
              }],
            });
            
            // After adding, try switching again
            await switchNetwork(targetChainId);
          }
        } catch (addError) {
          console.error('Error adding network:', addError);
          setWalletState(prev => ({
            ...prev,
            error: 'Failed to add network to MetaMask',
          }));
        }
      } else {
        let errorMessage = 'Failed to switch network';
        
        if (error.code === 4001) {
          errorMessage = 'User rejected network switch';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setWalletState(prev => ({
          ...prev,
          error: errorMessage,
        }));
      }
    }
  }, [isMetamaskInstalled, walletState.address, getBalance]);

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setWalletState({
        address: null,
        isConnected: false,
        isConnecting: false,
        error: null,
        chainId: null,
        balance: null,
      });
    } else {
      // User switched accounts
      const newAddress = accounts[0];
      setWalletState(prev => ({
        ...prev,
        address: newAddress,
        error: null,
      }));
      getBalance(newAddress);
    }
  }, [getBalance]);

  // Handle chain changes
  const handleChainChanged = useCallback((chainId: string) => {
    setWalletState(prev => ({
      ...prev,
      chainId,
      error: null,
    }));
    
    // Refresh page on chain change (MetaMask recommendation)
    window.location.reload();
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetamaskInstalled) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return;
    }

    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Get chain ID and balance
      await Promise.all([
        getChainId(),
        getBalance(address),
      ]);

      setWalletState(prev => ({
        ...prev,
        address,
        isConnected: true,
        isConnecting: false,
        error: null,
      }));

    } catch (error: any) {
      console.error('Connection error:', error);
      
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Please check MetaMask - connection request pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
    }
  }, [isMetamaskInstalled, getChainId, getBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      chainId: null,
      balance: null,
    });
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isMetamaskInstalled) return;

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletState(prev => ({
            ...prev,
            address,
            isConnected: true,
          }));
          
          await Promise.all([
            getChainId(),
            getBalance(address),
          ]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isMetamaskInstalled, handleAccountsChanged, handleChainChanged, getChainId, getBalance]);

  return {
    ...walletState,
    isMetamaskInstalled,
    connect,
    disconnect,
    switchNetwork,
  };
};
