"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';
import useAndromedaClient from '@/lib/andrjs/hooks/useAndromedaClient';
import { useWallet } from '@/lib/wallet/hooks/useWallet';
import { useToast as useCustomToast } from '../hooks/useToast';
import { Web3Storage } from 'web3.storage';

export default function MintPage() {
  const [tokenId, setTokenId] = useState('');
  const [tokenUri, setTokenUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const client = useAndromedaClient();
  const { address, isConnected } = useWallet();
  const { showSuccess, showError } = useCustomToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleMint = async () => {
    if (!isConnected) {
      showError({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to mint NFTs',
      });
      return;
    }

    if (!tokenId || !tokenUri) {
      showError({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual contract address
      const contractAddress = 'your_contract_address';
      
      const msg = {
        mint: {
          token_id: tokenId,
          owner: address,
          token_uri: tokenUri,
          extension: {
            publisher: address
          }
        }
      };

      const result = await client?.execute(contractAddress, msg, 'auto');
      
      showSuccess({
        title: 'NFT Minted Successfully!',
        description: `Transaction hash: ${result?.transactionHash}`,
      });

      // Clear form
      setTokenId('');
      setTokenUri('');
    } catch (error) {
      showError({
        title: 'Minting Failed',
        description: error instanceof Error ? error.message : 'An error occurred while minting',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setUploading(true);
    try {
      const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN! });
      const cid = await client.put([file]);
      const url = `https://${cid}.ipfs.dweb.link/${file.name}`;
      setTokenUri(url);
      showSuccess({
        title: 'Image uploaded to IPFS',
        description: `IPFS CID: ${cid}`,
      });
    } catch (err) {
      showError({
        title: 'Failed to upload image to IPFS',
        description: err instanceof Error ? err.message : 'An error occurred while uploading',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Mint New NFT</Heading>
          <Text color="gray.600">Create a new NFT in your collection</Text>
        </Box>

        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Token ID</FormLabel>
            <Input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter unique token ID"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Token URI</FormLabel>
            <Input
              value={tokenUri}
              onChange={(e) => setTokenUri(e.target.value)}
              placeholder="Enter token URI (IPFS hash or URL)"
            />
          </FormControl>

          <Button
            colorScheme="purple"
            onClick={handleMint}
            isLoading={isLoading}
            loadingText="Minting..."
            isDisabled={!isConnected}
          >
            {isConnected ? 'Mint NFT' : 'Connect Wallet to Mint'}
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
} 