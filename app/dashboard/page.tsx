'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Skeleton,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { useWallet } from '@/lib/wallet/hooks/useWallet';
import useAndromedaClient from '@/lib/andrjs/hooks/useAndromedaClient';
import { useToast as useCustomToast } from '../hooks/useToast';
import NFTCard from '../components/NFTCard';

export default function DashboardPage() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { address, isConnected } = useWallet();
  const client = useAndromedaClient();
  const { showError } = useCustomToast();

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!isConnected || !address || !client) {
        setLoading(false);
        return;
      }

      try {
        // Replace with your actual contract address
        const contractAddress = 'your_contract_address';
        
        const msg = {
          tokens: {
            owner: address,
            limit: 30,
          },
        };

        const response = await client.queryContract(contractAddress, msg);
        setNfts(response.tokens || []);
      } catch (error) {
        showError({
          title: 'Failed to Load NFTs',
          description: error instanceof Error ? error.message : 'An error occurred while loading your NFTs',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address, isConnected, client, showError]);

  const filteredNFTs = nfts.filter(nft =>
    nft.token_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4} align="center" justify="center" minH="60vh">
          <Heading size="lg">Connect Your Wallet</Heading>
          <Text color="gray.600">Please connect your wallet to view your NFTs</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>My NFTs</Heading>
          <Text color="gray.600">View and manage your NFT collection</Text>
        </Box>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search size={20} />
          </InputLeftElement>
          <Input
            placeholder="Search by token ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {loading ? (
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="300px" borderRadius="lg" />
            ))}
          </Grid>
        ) : filteredNFTs.length > 0 ? (
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.token_id} nft={nft} />
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.600">
              {searchQuery ? 'No NFTs found matching your search' : 'No NFTs found in your collection'}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 