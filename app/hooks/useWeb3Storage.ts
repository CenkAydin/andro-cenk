import { useCallback } from 'react';
import { Web3Storage } from 'web3.storage';

export const useWeb3Storage = () => {
  const uploadToIPFS = useCallback(
    async (
      file: File | Blob,
      onProgress?: (progress: number) => void
    ): Promise<string> => {
      const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
      if (!token) {
        throw new Error('Web3Storage token is required');
      }

      const client = new Web3Storage({ token });
      
      // Convert Blob to File if necessary
      const fileToUpload = file instanceof File 
        ? file 
        : new File([file], 'metadata.json', { type: 'application/json' });

      const cid = await client.put([fileToUpload], {
        onRootCidReady: (cid) => {
          console.log('Uploading to IPFS:', cid);
        },
        onStoredChunk: (bytes) => {
          if (onProgress) {
            // Calculate progress based on file size
            const progress = Math.min((bytes / fileToUpload.size) * 100, 100);
            onProgress(progress);
          }
        },
      });

      return cid;
    },
    []
  );

  return {
    uploadToIPFS,
  };
}; 