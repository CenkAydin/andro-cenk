"use client";

import { Box, Button, Container, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { NFTGrid } from "@/components/NFTGrid";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bgGradient="linear(to-r, blue.500, purple.500)" 
        color="white" 
        py={20}
        mb={12}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading 
              as="h1" 
              size="2xl" 
              fontWeight="bold"
              lineHeight="1.2"
            >
              Support Your Favorite Digital Artists
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Discover, collect, and support unique digital art on the blockchain. 
              Join our community of artists and collectors.
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              onClick={() => router.push('/mint')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Featured NFTs Section */}
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="stretch">
          <Box>
            <Heading as="h2" size="xl" mb={6}>
              Featured NFTs
            </Heading>
            <NFTGrid contractAddress="your-contract-address" />
          </Box>

          {/* How It Works Section */}
          <Box>
            <Heading as="h2" size="xl" mb={6}>
              How It Works
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <FeatureCard 
                title="Discover"
                description="Browse through unique digital art from talented artists"
              />
              <FeatureCard 
                title="Collect"
                description="Purchase NFTs and support your favorite artists"
              />
              <FeatureCard 
                title="Create"
                description="Mint your own NFTs and share your art with the world"
              />
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Box 
    p={6} 
    bg="white" 
    borderRadius="lg" 
    shadow="md"
    _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
    transition="all 0.2s"
  >
    <VStack align="start" spacing={4}>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.600">
        {description}
      </Text>
    </VStack>
  </Box>
);