"use client";

import { Box, Container } from "@chakra-ui/react";
import { Providers } from "../providers";
import Navbar from "@/modules/common/layout/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <Box minH="100vh" bg="gray.50">
                <Navbar />
                <Container maxW="container.xl" py={8}>
                    {children}
                </Container>
            </Box>
        </Providers>
    );
} 