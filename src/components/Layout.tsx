"use client";

import { Box, Container, Flex } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import Navbar from "@/modules/common/layout/components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container 
        maxW="container.xl" 
        py={8} 
        px={4}
        as="main"
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 