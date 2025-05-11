"use client";

import { Box, Image, Text, VStack, Button } from '@chakra-ui/react';
import Link from 'next/link';

interface NFT {
  token_id: string;
  token_uri?: string;
  extension?: {
    image?: string;
    name?: string;
    description?: string;
  };
}

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const imageUrl = nft.extension?.image || nft.token_uri;
  const name = nft.extension?.name || `NFT #${nft.token_id}`;
  const description = nft.extension?.description || 'No description available';

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Image
        src={imageUrl}
        alt={name}
        fallbackSrc="https://via.placeholder.com/300"
        height="200px"
        width="100%"
        objectFit="cover"
      />
      <VStack p={4} align="stretch" spacing={3}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
          {name}
        </Text>
        <Text color="gray.600" noOfLines={2}>
          {description}
        </Text>
        <Button
          as={Link}
          href={`/nft/${nft.token_id}`}
          colorScheme="purple"
          size="sm"
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );
} 