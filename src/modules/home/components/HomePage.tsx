"use client";
import { Box, GridItem, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import EmbeddableList from "./List";
import Layout from "@/modules/common/layout/components/Layout";

interface HomePageProps {
  apps: string[]
  chainId: string;
}
const HomePage: FC<HomePageProps> = (props) => {
  const { apps, chainId } = props;
  return (
    <Layout>
      <Box>
        <Heading textAlign={'start'} fontWeight='600' fontSize={'24px'}>
          Explore Apps created by community
        </Heading>
        <EmbeddableList apps={apps} chainId={chainId} />
      </Box>
    </Layout>
  );
};
export default HomePage;
