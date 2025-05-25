"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
} from "@chakra-ui/react";
import NextLink from "next/link";
import WalletConnect from "./WalletConnect";

export default function Header() {
  return (
    <Box as="header" py={4} borderBottom="1px" borderColor="var(--border-color)">
      <Container maxW="container.xl">
        <Flex align="center">
          <NextLink href="/" passHref>
            <Link>
              <Heading size="lg" className="text-serif">
                ArtMecra
              </Heading>
            </Link>
          </NextLink>
          <Spacer />
          <HStack spacing={8}>
            <NextLink href="/gallery" passHref>
              <Link>Gallery</Link>
            </NextLink>
            <NextLink href="/artist-dashboard" passHref>
              <Link>Artist Studio</Link>
            </NextLink>
            <WalletConnect />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
} 