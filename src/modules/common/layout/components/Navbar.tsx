"use client";

import { Box, Flex, Text, HStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { CollectionDropdown, ConnectWallet } from "@/modules/common/cta";
import useApp from "@/lib/app/hooks/useApp";
import Link from "next/link";
import { LINKS } from "@/utils/links";
import { useRouter } from "next/navigation";

interface NavbarProps {}
const Navbar: FC<NavbarProps> = (props) => {
  const {} = props;
  const { config } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [artistAddress, setArtistAddress] = useState("");

  const handleArtistProfile = () => {
    if (!artistAddress) {
      toast({
        title: "Error",
        description: "Please enter an artist address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      router.push(`/artist/${artistAddress}`);
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to artist profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleArtistProfile();
    }
  };

  return (
    <Box 
      py={4} 
      px={8} 
      bg="white" 
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex
        direction="row"
        alignItems="center"
        maxW="container.xl"
        mx="auto"
        gap={6}
      >
        <Link href={LINKS.home()} passHref legacyBehavior>
          <Text 
            as="a" 
            fontSize="2xl" 
            fontWeight="bold"
            bgGradient="linear(to-r, blue.500, purple.500)"
            bgClip="text"
            _hover={{ opacity: 0.8 }}
          >
            CanvasPatron
          </Text>
        </Link>

        <HStack spacing={6} ml={8}>
          <Link href="/mint" passHref legacyBehavior>
            <Text 
              as="a" 
              fontSize="md" 
              fontWeight="medium" 
              color="gray.700"
              _hover={{ color: "blue.500" }}
            >
              Mint NFT
            </Text>
          </Link>
          <Link href="/marketplace" passHref legacyBehavior>
            <Text 
              as="a" 
              fontSize="md" 
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: "blue.500" }}
            >
              Marketplace
            </Text>
          </Link>
          <InputGroup size="md" maxW="240px">
            <Input
              placeholder="Artist Address"
              value={artistAddress}
              onChange={(e) => setArtistAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              fontSize="md"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              _focus={{ borderColor: "blue.500", boxShadow: "sm" }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="2rem"
                size="sm"
                onClick={handleArtistProfile}
                isDisabled={!artistAddress}
                colorScheme="blue"
                borderRadius="md"
              >
                View
              </Button>
            </InputRightElement>
          </InputGroup>
          <Link href="/releases" passHref legacyBehavior>
            <Text 
              as="a" 
              fontSize="md" 
              fontWeight="medium"
              color="gray.700"
              _hover={{ color: "blue.500" }}
            >
              Pending Releases
            </Text>
          </Link>
        </HStack>

        <Flex direction="row" ml="auto" gap={3}>
          <CollectionDropdown />
          <ConnectWallet />
        </Flex>
      </Flex>
    </Box>
  );
};
export default Navbar;
