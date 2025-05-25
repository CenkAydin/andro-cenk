"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { Download, Share2, Filter, ChevronRight } from 'lucide-react';
import { useCreatorSupport } from '../hooks/useCreatorSupport';
import { useAndromedaClient } from '../hooks/useAndromedaClient';

interface ArtistStats {
  totalSales: number;
  lockedFunds: string;
  unlockedFunds: string;
  totalArtworks: number;
  recentSales: Sale[];
  topSupporters: Supporter[];
  artworkPerformance: ArtworkPerformance[];
}

interface Sale {
  id: string;
  artworkName: string;
  buyer: string;
  amount: string;
  timestamp: string;
}

interface Supporter {
  address: string;
  totalSupport: string;
  lastSupport: string;
  artworksOwned: number;
}

interface ArtworkPerformance {
  tokenId: string;
  name: string;
  views: number;
  likes: number;
  sales: number;
  revenue: string;
}

export default function ArtistDashboard() {
  const [stats, setStats] = useState<ArtistStats>({
    totalSales: 0,
    lockedFunds: '0',
    unlockedFunds: '0',
    totalArtworks: 0,
    recentSales: [],
    topSupporters: [],
    artworkPerformance: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();
  const { client } = useAndromedaClient();
  const { getArtistBalance, claimArtistFunds } = useCreatorSupport(
    process.env.NEXT_PUBLIC_CREATOR_SUPPORT_CONTRACT || ''
  );

  useEffect(() => {
    const fetchStats = async () => {
      if (!client) return;

      try {
        const address = client.getAddress();
        if (!address) return;

        const balance = await getArtistBalance(address);
        
        // TODO: Fetch actual data from contract
        // This is mock data for demonstration
        setStats({
          totalSales: 15,
          lockedFunds: balance.locked,
          unlockedFunds: balance.unlocked,
          totalArtworks: 8,
          recentSales: [
            {
              id: '1',
              artworkName: 'Digital Dreams',
              buyer: '0x123...',
              amount: '1 ANDR',
              timestamp: '2024-03-15',
            },
            // Add more mock sales
          ],
          topSupporters: [
            {
              address: '0x456...',
              totalSupport: '5 ANDR',
              lastSupport: '2024-03-14',
              artworksOwned: 3,
            },
            // Add more mock supporters
          ],
          artworkPerformance: [
            {
              tokenId: '1',
              name: 'Digital Dreams',
              views: 150,
              likes: 45,
              sales: 3,
              revenue: '3 ANDR',
            },
            // Add more mock performance data
          ],
        });
      } catch (error) {
        toast({
          title: 'Error Loading Stats',
          description: error instanceof Error ? error.message : 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [client, getArtistBalance, toast]);

  const handleClaimFunds = async () => {
    if (!client) return;

    try {
      const address = client.getAddress();
      if (!address) return;

      const txHash = await claimArtistFunds(address);
      toast({
        title: 'Funds Claimed Successfully!',
        description: `Transaction Hash: ${txHash}`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      // Refresh stats
      const balance = await getArtistBalance(address);
      setStats((prev) => ({
        ...prev,
        lockedFunds: balance.locked,
        unlockedFunds: balance.unlocked,
      }));
    } catch (error) {
      toast({
        title: 'Error Claiming Funds',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={12} align="stretch">
        <Box>
          <Heading size="2xl" mb={2} className="text-serif">
            Artist Studio
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Manage your artwork and track your success
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card className="card">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Total Sales</StatLabel>
                <StatNumber className="text-serif">{stats.totalSales}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card className="card">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Locked Funds</StatLabel>
                <StatNumber className="text-serif">{stats.lockedFunds} ANDR</StatNumber>
                <StatHelpText>Available after lock period</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card className="card">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Unlocked Funds</StatLabel>
                <StatNumber className="text-serif">{stats.unlockedFunds} ANDR</StatNumber>
                <StatHelpText>Ready to claim</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card className="card">
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Total Artworks</StatLabel>
                <StatNumber className="text-serif">{stats.totalArtworks}</StatNumber>
                <StatHelpText>Published pieces</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card className="card">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="md" className="text-serif">
                  Available Funds
                </Heading>
                <IconButton
                  aria-label="Share"
                  icon={<Share2 size={16} />}
                  variant="ghost"
                  className="btn-ghost"
                />
              </HStack>
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text color="gray.500">Locked: {stats.lockedFunds} ANDR</Text>
                  <Text color="gray.500">Unlocked: {stats.unlockedFunds} ANDR</Text>
                </HStack>
                <Progress
                  value={(Number(stats.unlockedFunds) / (Number(stats.lockedFunds) + Number(stats.unlockedFunds))) * 100}
                  size="sm"
                  className="progress"
                />
              </Box>
              <Button
                className="btn-outline"
                onClick={handleClaimFunds}
                isDisabled={Number(stats.unlockedFunds) === 0}
                size="lg"
              >
                Claim Available Funds
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card className="card">
          <CardBody>
            <Tabs>
              <TabList>
                <Tab className="text-serif">Recent Sales</Tab>
                <Tab className="text-serif">Top Supporters</Tab>
                <Tab className="text-serif">Artwork Performance</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <HStack justify="space-between" mb={4}>
                    <Text color="gray.500">Latest transactions</Text>
                    <IconButton
                      aria-label="Download"
                      icon={<Download size={16} />}
                      variant="ghost"
                      className="btn-ghost"
                    />
                  </HStack>
                  <Table variant="simple" className="table">
                    <Thead>
                      <Tr>
                        <Th>Artwork</Th>
                        <Th>Buyer</Th>
                        <Th>Amount</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.recentSales.map((sale) => (
                        <Tr key={sale.id}>
                          <Td fontWeight="500">{sale.artworkName}</Td>
                          <Td>{sale.buyer}</Td>
                          <Td>{sale.amount}</Td>
                          <Td>{sale.timestamp}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>

                <TabPanel>
                  <HStack justify="space-between" mb={4}>
                    <Text color="gray.500">Your most loyal supporters</Text>
                    <IconButton
                      aria-label="Filter"
                      icon={<Filter size={16} />}
                      variant="ghost"
                      className="btn-ghost"
                    />
                  </HStack>
                  <Table variant="simple" className="table">
                    <Thead>
                      <Tr>
                        <Th>Supporter</Th>
                        <Th>Total Support</Th>
                        <Th>Last Support</Th>
                        <Th>Artworks Owned</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.topSupporters.map((supporter) => (
                        <Tr key={supporter.address}>
                          <Td>
                            <HStack>
                              <Avatar size="sm" className="avatar" />
                              <Text fontWeight="500">{supporter.address}</Text>
                            </HStack>
                          </Td>
                          <Td>{supporter.totalSupport}</Td>
                          <Td>{supporter.lastSupport}</Td>
                          <Td>{supporter.artworksOwned}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>

                <TabPanel>
                  <HStack justify="space-between" mb={4}>
                    <Text color="gray.500">Performance metrics</Text>
                    <IconButton
                      aria-label="Download"
                      icon={<Download size={16} />}
                      variant="ghost"
                      className="btn-ghost"
                    />
                  </HStack>
                  <Table variant="simple" className="table">
                    <Thead>
                      <Tr>
                        <Th>Artwork</Th>
                        <Th>Views</Th>
                        <Th>Likes</Th>
                        <Th>Sales</Th>
                        <Th>Revenue</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.artworkPerformance.map((artwork) => (
                        <Tr key={artwork.tokenId}>
                          <Td>
                            <HStack>
                              <Text fontWeight="500">{artwork.name}</Text>
                              <IconButton
                                aria-label="View details"
                                icon={<ChevronRight size={16} />}
                                variant="ghost"
                                size="sm"
                                className="btn-ghost"
                              />
                            </HStack>
                          </Td>
                          <Td>{artwork.views}</Td>
                          <Td>{artwork.likes}</Td>
                          <Td>{artwork.sales}</Td>
                          <Td>{artwork.revenue}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
} 