"use client";

import { Box, SimpleGrid, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useGetCw721Tokens, useGetCw721Token } from "@/lib/graphql/hooks/cw721";

interface NFTGridProps {
  contractAddress: string;
}

export const NFTGrid: React.FC<NFTGridProps> = ({ contractAddress }) => {
  const { data: tokenIds, loading, error } = useGetCw721Tokens(contractAddress);

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {[1, 2, 3].map((i) => (
          <Box key={i} p={4} bg="white" borderRadius="lg" shadow="md">
            <Box h="200px" bg="gray.100" borderRadius="md" mb={4} />
            <VStack align="start" spacing={2}>
              <Box h="24px" w="60%" bg="gray.100" borderRadius="md" />
              <Box h="20px" w="40%" bg="gray.100" borderRadius="md" />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="md">
        Failed to load NFTs. Please try again later.
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
      {tokenIds?.slice(0, 6).map((tokenId: string) => {
        const { data: token } = useGetCw721Token(contractAddress, tokenId);
        return (
          <Box 
            key={tokenId} 
            p={4} 
            bg="white" 
            borderRadius="lg" 
            shadow="md"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <Image
              src={token?.metadata?.image || '/placeholder.png'}
              alt={token?.metadata?.name || 'NFT'}
              borderRadius="md"
              objectFit="cover"
              w="full"
              h="200px"
              mb={4}
            />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold" fontSize="lg">
                {token?.metadata?.name || 'Untitled'}
              </Text>
              <Text color="gray.600" noOfLines={2}>
                {token?.metadata?.description || 'No description available'}
              </Text>
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}; 