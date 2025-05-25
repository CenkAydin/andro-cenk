"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Avatar,
  Badge,
  useToast,
  Skeleton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { Search, Heart, Share2, Bookmark, Filter } from 'lucide-react';
import { useCreatorSupport } from '../hooks/useCreatorSupport';
import { useAndromedaClient } from '../hooks/useAndromedaClient';

interface Artwork {
  token_id: string;
  owner: string;
  token_uri: string;
  extension: {
    name: string;
    description: string;
    image: string;
  };
}

interface Artist {
  address: string;
  name: string;
  bio: string;
  avatar: string;
  totalArtworks: number;
  totalSupporters: number;
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const { client } = useAndromedaClient();
  const { getArtworkDetails, purchaseArtwork } = useCreatorSupport(
    process.env.NEXT_PUBLIC_CREATOR_SUPPORT_CONTRACT || ''
  );

  useEffect(() => {
    const fetchArtworks = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement artwork fetching from contract
        // This is a placeholder for demonstration
        const mockArtworks: Artwork[] = [
          {
            token_id: '1',
            owner: 'artist1',
            token_uri: 'ipfs://...',
            extension: {
              name: 'Digital Dreams',
              description: 'A mesmerizing digital artwork',
              image: 'https://via.placeholder.com/300',
            },
          },
          // Add more mock artworks
        ];

        setArtworks(mockArtworks);

        // TODO: Implement artist profile fetching
        const mockArtists: Artist[] = [
          {
            address: 'artist1',
            name: 'Jane Doe',
            bio: 'Digital artist exploring the intersection of art and technology',
            avatar: 'https://via.placeholder.com/100',
            totalArtworks: 5,
            totalSupporters: 12,
          },
          // Add more mock artists
        ];

        setArtists(mockArtists);
      } catch (error) {
        toast({
          title: 'Error Loading Gallery',
          description: error instanceof Error ? error.message : 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, [toast]);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    onOpen();
  };

  const handlePurchase = async () => {
    if (!selectedArtwork || !client) return;

    try {
      const txHash = await purchaseArtwork({
        token_id: selectedArtwork.token_id,
        buyer: client.getAddress() || '',
        price: '1000000', // 1 ANDR in uandr
      });

      toast({
        title: 'Artwork Purchased Successfully!',
        description: `Transaction Hash: ${txHash}`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error Purchasing Artwork',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.extension.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={12} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading size="2xl" mb={4} className="text-serif">
            ArtMecra Gallery
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Discover and support emerging digital artists
          </Text>
        </Box>

        <HStack spacing={4} mb={8}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Search size={20} color="var(--secondary-color)" />
            </InputLeftElement>
            <Input
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              bg="white"
            />
          </InputGroup>
          <IconButton
            aria-label="Filter"
            icon={<Filter size={20} />}
            variant="ghost"
            className="btn-ghost"
          />
        </HStack>

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="500px" borderRadius="lg" className="skeleton" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredArtworks.map((artwork) => (
              <Box
                key={artwork.token_id}
                className="card"
                cursor="pointer"
                onClick={() => handleArtworkClick(artwork)}
                overflow="hidden"
              >
                <Box position="relative">
                  <img
                    src={artwork.extension.image}
                    alt={artwork.extension.name}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                    }}
                  />
                  <HStack
                    position="absolute"
                    top={4}
                    right={4}
                    spacing={2}
                  >
                    <IconButton
                      aria-label="Like"
                      icon={<Heart size={16} />}
                      variant="ghost"
                      className="btn-ghost"
                      colorScheme="whiteAlpha"
                    />
                    <IconButton
                      aria-label="Bookmark"
                      icon={<Bookmark size={16} />}
                      variant="ghost"
                      className="btn-ghost"
                      colorScheme="whiteAlpha"
                    />
                    <IconButton
                      aria-label="Share"
                      icon={<Share2 size={16} />}
                      variant="ghost"
                      className="btn-ghost"
                      colorScheme="whiteAlpha"
                    />
                  </HStack>
                </Box>
                <Box p={6}>
                  <Heading size="md" mb={2} className="text-serif">
                    {artwork.extension.name}
                  </Heading>
                  <Text color="gray.600" noOfLines={2} mb={4}>
                    {artwork.extension.description}
                  </Text>
                  <Divider mb={4} />
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        src={artists.find((a) => a.address === artwork.owner)?.avatar}
                        className="avatar"
                      />
                      <Text fontSize="sm" fontWeight="500">
                        {artists.find((a) => a.address === artwork.owner)?.name}
                      </Text>
                    </HStack>
                    <Badge className="badge">1 ANDR</Badge>
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent className="modal-content">
            <ModalHeader className="text-serif">
              {selectedArtwork?.extension.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={8}>
              {selectedArtwork && (
                <VStack spacing={6} align="stretch">
                  <img
                    src={selectedArtwork.extension.image}
                    alt={selectedArtwork.extension.name}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      maxHeight: '500px',
                      objectFit: 'contain',
                    }}
                  />
                  <Text fontSize="lg" color="gray.600">
                    {selectedArtwork.extension.description}
                  </Text>
                  <Divider />
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.500">
                        Artist
                      </Text>
                      <HStack>
                        <Avatar
                          size="sm"
                          src={artists.find((a) => a.address === selectedArtwork.owner)?.avatar}
                          className="avatar"
                        />
                        <Text fontWeight="500">
                          {artists.find((a) => a.address === selectedArtwork.owner)?.name}
                        </Text>
                      </HStack>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Text fontSize="sm" color="gray.500">
                        Price
                      </Text>
                      <Text fontSize="xl" fontWeight="600">
                        1 ANDR
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    size="lg"
                    className="btn-outline"
                    onClick={handlePurchase}
                    width="full"
                  >
                    Support Artist
                  </Button>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
} 