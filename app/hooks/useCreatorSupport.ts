import { useCallback, useState } from 'react';
import { useAndromedaClient } from './useAndromedaClient';
import { CreatorSupportADO, MintArtworkMsg, PurchaseArtworkMsg } from '../../contracts/creator_support_ado';

export const useCreatorSupport = (contractAddress: string) => {
  const { client } = useAndromedaClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const creatorSupport = new CreatorSupportADO(client, contractAddress, {
    platform_fee_address: process.env.NEXT_PUBLIC_PLATFORM_FEE_ADDRESS || '',
    revenue_split_ratio: Number(process.env.NEXT_PUBLIC_REVENUE_SPLIT_RATIO) || 90,
    timelock_duration: Number(process.env.NEXT_PUBLIC_TIMELOCK_DURATION) || 2592000, // 30 days
  });

  const mintArtwork = useCallback(
    async (msg: MintArtworkMsg) => {
      setIsLoading(true);
      setError(null);
      try {
        const txHash = await creatorSupport.mintArtwork(msg);
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to mint artwork'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [creatorSupport]
  );

  const purchaseArtwork = useCallback(
    async (msg: PurchaseArtworkMsg) => {
      setIsLoading(true);
      setError(null);
      try {
        const txHash = await creatorSupport.purchaseArtwork(msg);
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to purchase artwork'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [creatorSupport]
  );

  const claimArtistFunds = useCallback(
    async (artist: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const txHash = await creatorSupport.claimArtistFunds(artist);
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to claim funds'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [creatorSupport]
  );

  const getArtistBalance = useCallback(
    async (artist: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const balance = await creatorSupport.getArtistBalance(artist);
        return balance;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get artist balance'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [creatorSupport]
  );

  const getArtworkDetails = useCallback(
    async (tokenId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await creatorSupport.getArtworkDetails(tokenId);
        return details;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get artwork details'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [creatorSupport]
  );

  return {
    mintArtwork,
    purchaseArtwork,
    claimArtistFunds,
    getArtistBalance,
    getArtworkDetails,
    isLoading,
    error,
  };
}; 