"use client";

import { useParams } from "next/navigation";
import { Box, Heading, Text, VStack, Grid, Button, HStack } from "@chakra-ui/react";
import CONFIG from '@/config';
import { useGetCw721Tokens } from '@/lib/graphql/hooks/cw721';
import Link from 'next/link';
import { IAuctionCollection } from '@/lib/app/types';

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params?.id as string;
  const collection = CONFIG.collections.find(col => col.id === collectionId) as IAuctionCollection | undefined;

  if (!collection) {
    return (
      <Box maxW="container.md" mx="auto" py={8} px={4}>
        <Heading size="lg">Collection Not Found</Heading>
        <Text>The collection you are looking for does not exist.</Text>
      </Box>
    );
  }

  const { data: tokens, loading } = useGetCw721Tokens(collection.cw721);

  return (
    <Box maxW="container.xl" mx="auto" py={8} px={4}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">{collection.name}</Heading>
        <Text fontSize="md" color="gray.600">Collection Address: <b>{collection.cw721}</b></Text>
        {collection.description && <Text>{collection.description}</Text>}
        <Heading size="md" mt={8}>NFTs in this Collection</Heading>
        {loading ? (
          <Text>Loading NFTs...</Text>
        ) : tokens?.length === 0 ? (
          <Text>No NFTs found in this collection.</Text>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {tokens?.map((tokenId) => (
              <Box
                key={tokenId}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
              >
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold">Token ID: {tokenId}</Text>
                  <HStack>
                    <Button
                      as={Link}
                      href={`/preview/${collection.id}/cw721/${tokenId}`}
                      size="sm"
                      colorScheme="blue"
                    >
                      View NFT
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
} 