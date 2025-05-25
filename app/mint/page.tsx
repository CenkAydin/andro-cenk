"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Image,
  Progress,
} from '@chakra-ui/react';
import { useCreatorSupport } from '../hooks/useCreatorSupport';
import { useAndromedaClient } from '../hooks/useAndromedaClient';
import { useWeb3Storage } from '../hooks/useWeb3Storage';

export default function MintPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const toast = useToast();
  const { client } = useAndromedaClient();
  const { uploadToIPFS } = useWeb3Storage();
  const { mintArtwork, isLoading: isMinting } = useCreatorSupport(
    process.env.NEXT_PUBLIC_CREATOR_SUPPORT_CONTRACT || ''
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !name || !description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields and select an image.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload image to IPFS
      const imageCid = await uploadToIPFS(image, (progress) => {
        setUploadProgress(progress);
      });

      // Create metadata
      const metadata = {
        name,
        description,
        image: `ipfs://${imageCid}`,
      };

      // Upload metadata to IPFS
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });
      const metadataCid = await uploadToIPFS(metadataBlob);

      // Mint NFT
      const tokenId = Date.now().toString();
      const txHash = await mintArtwork({
        token_id: tokenId,
        owner: client?.getAddress() || '',
        token_uri: `ipfs://${metadataCid}`,
        extension: {
          name,
          description,
          image: `ipfs://${imageCid}`,
        },
      });

      toast({
        title: 'Artwork Published Successfully!',
        description: `Transaction Hash: ${txHash}`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      // Reset form
      setName('');
      setDescription('');
      setImage(null);
      setPreviewUrl('');
    } catch (error) {
      toast({
        title: 'Error Publishing Artwork',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Publish Your Artwork
          </Heading>
          <Text color="gray.600">
            Share your creation with the world and receive support from your audience
          </Text>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          _dark={{ bg: 'gray.700' }}
        >
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Artwork Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your artwork"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork"
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Artwork Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                p={1}
              />
              {previewUrl && (
                <Box mt={4}>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    maxH="200px"
                    mx="auto"
                    borderRadius="md"
                  />
                </Box>
              )}
            </FormControl>

            {(isUploading || isMinting) && (
              <Box w="100%">
                <Progress
                  value={isUploading ? uploadProgress : 100}
                  size="sm"
                  colorScheme="purple"
                  mb={2}
                />
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  {isUploading
                    ? 'Uploading to IPFS...'
                    : 'Publishing your artwork...'}
                </Text>
              </Box>
            )}

            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              w="100%"
              isLoading={isUploading || isMinting}
              loadingText={isUploading ? 'Uploading...' : 'Publishing...'}
            >
              Publish Artwork
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 