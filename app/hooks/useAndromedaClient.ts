import { useCallback, useEffect, useState } from 'react';
import { AndromedaClient } from '@andromedaprotocol/andromeda.js';

export const useAndromedaClient = () => {
  const [client, setClient] = useState<AndromedaClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initializeClient = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_ANDROMEDA_RPC;
      const restUrl = process.env.NEXT_PUBLIC_ANDROMEDA_REST;

      if (!rpcUrl || !restUrl) {
        throw new Error('Andromeda RPC and REST URLs are required');
      }

      const newClient = new AndromedaClient({
        rpcUrl,
        restUrl,
      });

      await newClient.connect();
      setClient(newClient);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Andromeda client'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeClient();
  }, [initializeClient]);

  return {
    client,
    isLoading,
    error,
    initializeClient,
  };
}; 