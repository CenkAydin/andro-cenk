"use client";

import Link from 'next/link';
import { Box, Flex, HStack, Heading, Spacer, Button } from '@chakra-ui/react';
import ColorModeToggle from './ColorModeToggle';

export default function Header() {
    return (
        <Box as="header" bg="gray.900" color="white" px={6} py={4} boxShadow="sm">
            <Flex align="center">
                <Heading size="md">
                    <Link href="/">NFT Marketplace</Link>
                </Heading>
                <Spacer />
                <HStack spacing={4}>
                    <Button as={Link} href="/mint" variant="ghost" colorScheme="purple">Mint</Button>
                    <Button as={Link} href="/dashboard" variant="ghost" colorScheme="purple">Dashboard</Button>
                    <ColorModeToggle />
                </HStack>
            </Flex>
        </Box>
    );
} 