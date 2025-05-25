"use client";

import { useAndromedaStore } from "@/zustand/andromeda";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Msg } from "@andromedaprotocol/andromeda.js";

interface PendingRelease {
  timelockAddress: string;
  amount: string;
  denom: string;
  releaseTime: number;
  isReleased: boolean;
}

export default function ReleasesPage() {
  const [pendingReleases, setPendingReleases] = useState<PendingRelease[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { client } = useAndromedaStore();

  // Fetch pending releases for the connected wallet
  const fetchPendingReleases = useCallback(async () => {
    if (!client) return;

    try {
      // Query all timelock contracts where the current user is the beneficiary
      const queryMsg = {
        get_pending_releases: {
          beneficiary: client.signerAddress,
        },
      };

      // This is a placeholder - you'll need to implement the actual query logic
      // based on your timelock-ado contract's query interface
      const response = await client.query("YOUR_TIMELOCK_ADO_ADDRESS", queryMsg);
      
      setPendingReleases(response.pending_releases || []);
    } catch (error) {
      console.error("Error fetching pending releases:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending releases",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [client, toast]);

  useEffect(() => {
    fetchPendingReleases();
  }, [fetchPendingReleases]);

  const handleRelease = useCallback(async (timelockAddress: string) => {
    if (!client) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      const releaseMsg: Msg = {
        release: {}, // Empty object as the release message doesn't need parameters
      };

      await client.execute(timelockAddress, releaseMsg);

      toast({
        title: "Success",
        description: "Funds released successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Refresh the list of pending releases
      await fetchPendingReleases();
    } catch (error) {
      console.error("Error releasing funds:", error);
      toast({
        title: "Error",
        description: "Failed to release funds. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [client, fetchPendingReleases, toast]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const isReleaseable = (releaseTime: number) => {
    return Math.floor(Date.now() / 1000) >= releaseTime;
  };

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">
          Pending Releases
        </Heading>

        {pendingReleases.length === 0 ? (
          <Text>No pending releases found.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Amount</Th>
                <Th>Release Date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pendingReleases.map((release) => (
                <Tr key={release.timelockAddress}>
                  <Td>
                    {release.amount} {release.denom}
                  </Td>
                  <Td>{formatDate(release.releaseTime)}</Td>
                  <Td>
                    {release.isReleased
                      ? "Released"
                      : isReleaseable(release.releaseTime)
                      ? "Ready to Release"
                      : "Locked"}
                  </Td>
                  <Td>
                    {!release.isReleased && isReleaseable(release.releaseTime) && (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleRelease(release.timelockAddress)}
                        isLoading={isLoading}
                      >
                        Release
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  );
} 