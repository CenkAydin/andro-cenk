"use client";

import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Textarea, VStack, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MintFormData {
  title: string;
  description: string;
  imageUri: string;
}

export default function MintPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<MintFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const onSubmit = async (data: MintFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement minting logic
      console.log('Minting NFT:', data);
      
      toast({
        title: "Success",
        description: "Your NFT has been minted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/marketplace');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Mint Your NFT
          </Heading>
          <Box color="gray.600">
            Create and mint your unique digital artwork on the blockchain
          </Box>
        </Box>

        <Box 
          as="form" 
          onSubmit={handleSubmit(onSubmit)}
          bg="white"
          p={8}
          borderRadius="lg"
          shadow="md"
        >
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                {...register("title", { 
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" }
                })}
                placeholder="Enter NFT title"
                size="lg"
                borderRadius="md"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "sm" }}
              />
              <FormErrorMessage>
                {errors.title?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description", { 
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" }
                })}
                placeholder="Describe your NFT"
                size="lg"
                borderRadius="md"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "sm" }}
                rows={4}
              />
              <FormErrorMessage>
                {errors.description?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.imageUri}>
              <FormLabel>Image URI</FormLabel>
              <Input
                {...register("imageUri", { 
                  required: "Image URI is required",
                  pattern: { 
                    value: /^https?:\/\/.+/,
                    message: "Must be a valid URL"
                  }
                })}
                placeholder="https://example.com/image.png"
                size="lg"
                borderRadius="md"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "sm" }}
              />
              <FormErrorMessage>
                {errors.imageUri?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Minting..."
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              Mint NFT
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 