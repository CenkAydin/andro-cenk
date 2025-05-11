import { useAndromedaStore } from '@/zustand/andromeda';

export const useWallet = () => {
  const { accounts, isConnected } = useAndromedaStore();
  return {
    address: accounts[0]?.address,
    isConnected
  };
}; 