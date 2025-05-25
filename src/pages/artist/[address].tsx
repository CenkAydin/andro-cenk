"use client";

import { useAndromedaStore } from "@/zustand/andromeda";
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import SupportArtistButton from "@/components/SupportArtistButton";
import { useGetCw721Tokens, useGetCw721Token } from "@/lib/graphql/hooks/cw721";
import { useGetTokenMarketplaceInfo } from "@/lib/graphql/hooks/marketplace";

interface ArtistNFT {
  contractAddress: string;
  tokenId: string;
  imageUrl: string;
  title: string;
  marketplaceAddress: string;
}

interface LockedRevenue {
  amount: string;
  denom: string;
  releaseDate: number;
  isReleased: boolean;
}

export default function ArtistProfile({ params }: { params: { address: string } }) {
  const [nfts, setNfts] = useState<ArtistNFT[]>([]);
  const [lockedRevenue, setLockedRevenue] = useState<LockedRevenue[]>([]);
  const [totalLocked, setTotalLocked] = useState<string>("0");
  const toast = useToast();
  const { client } = useAndromedaStore();

  // Fetch all NFTs minted by the artist
  const { data: artistNFTs } = useGetCw721Tokens(params.address);

  // Fetch marketplace info for each NFT
  const fetchMarketplaceInfo = useCallback(async (nft: ArtistNFT) => {
    try {
      const { data: marketplaceState } = await useGetTokenMarketplaceInfo(
        nft.marketplaceAddress,
        nft.contractAddress,
        nft.tokenId
      );
      return marketplaceState;
    } catch (error) {
      console.error("Error fetching marketplace info:", error);
      return null;
    }
  }, []);

  // Fetch locked revenue from timelock contracts
  const fetchLockedRevenue = useCallback(async () => {
    if (!client) return;

    try {
      const queryMsg = {
        get_pending_releases: {
          beneficiary: params.address,
        },
      };

      // Query all timelock contracts where the artist is the beneficiary
      const response = await client.chainClient?.queryClient?.queryContractSmart(
        "YOUR_TIMELOCK_ADO_ADDRESS",
        queryMsg
      );
      
      const revenue = response?.pending_releases || [];
      setLockedRevenue(revenue);

      // Calculate total locked amount
      const total = revenue.reduce((sum: number, release: LockedRevenue) => {
        if (!release.isReleased) {
          return sum + parseFloat(release.amount);
        }
        return sum;
      }, 0);

      setTotalLocked(total.toString());
    } catch (error) {
      console.error("Error fetching locked revenue:", error);
      toast({
        title: "Error",
        description: "Failed to fetch locked revenue information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [client, params.address, toast]);

  useEffect(() => {
    if (artistNFTs) {
      // Fetch token details for each token ID
      const fetchTokenDetails = async () => {
        const tokenDetails = await Promise.all(
          artistNFTs.map(async (tokenId) => {
            const { data: token } = await useGetCw721Token(params.address, tokenId);
            return {
              contractAddress: params.address,
              tokenId,
              imageUrl: token?.metadata?.image || "/placeholder-nft.png",
              title: token?.metadata?.name || `NFT #${tokenId}`,
              marketplaceAddress: "YOUR_MARKETPLACE_ADDRESS", // You'll need to get this from your marketplace contract
            };
          })
        );
        setNfts(tokenDetails);
      };

      fetchTokenDetails();
    }
  }, [artistNFTs, params.address]);

  useEffect(() => {
    fetchLockedRevenue();
  }, [fetchLockedRevenue]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Artist Header */}
        <Box>
          <Heading size="xl">Artist Profile</Heading>
          <Text color="gray.600" mt={2}>
            {params.address}
          </Text>
        </Box>

        {/* Revenue Stats */}
        <Box
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
        >
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Stat>
              <StatLabel>Total Locked Revenue</StatLabel>
              <StatNumber>{totalLocked} {lockedRevenue[0]?.denom || "TOKENS"}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Next Release</StatLabel>
              <StatNumber>
                {lockedRevenue.length > 0
                  ? formatDate(lockedRevenue[0].releaseDate)
                  : "No pending releases"}
              </StatNumber>
              <StatHelpText>
                {lockedRevenue.length > 0
                  ? `${lockedRevenue.length} more releases pending`
                  : "All funds released"}
              </StatHelpText>
            </Stat>
          </Grid>
        </Box>

        {/* NFT Grid */}
        <Box>
          <Heading size="lg" mb={6}>
            Artist's NFTs
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {nfts.map((nft) => (
              <Box
                key={`${nft.contractAddress}-${nft.tokenId}`}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
              >
                <Image
                  src={nft.imageUrl}
                  alt={nft.title}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Heading size="md" mb={2}>
                    {nft.title}
                  </Heading>
                  <HStack justify="space-between" align="center">
                    <Badge colorScheme="purple">NFT #{nft.tokenId}</Badge>
                    <SupportArtistButton
                      marketplaceAddress={nft.marketplaceAddress}
                      contractAddress={nft.contractAddress}
                      tokenId={nft.tokenId}
                      artistAddress={params.address}
                      platformTreasuryAddress="YOUR_PLATFORM_TREASURY_ADDRESS"
                      size="sm"
                    />
                  </HStack>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
} 