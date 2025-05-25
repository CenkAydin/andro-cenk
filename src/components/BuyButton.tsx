"use client";

import { useGetTokenMarketplaceInfo } from "@/lib/graphql/hooks/marketplace";
import { useAndromedaStore } from "@/zustand/andromeda";
import { Button, ButtonProps, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Msg } from "@andromedaprotocol/andromeda.js";
import { coin } from "@cosmjs/proto-signing";

interface BuyButtonProps extends ButtonProps {
  marketplaceAddress: string;
  contractAddress: string;
  tokenId: string;
  artistAddress: string;
  platformTreasuryAddress: string;
}

export default function BuyButton({
  marketplaceAddress,
  contractAddress,
  tokenId,
  artistAddress,
  platformTreasuryAddress,
  ...buttonProps
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { client } = useAndromedaStore();
  
  const { data: marketplaceState } = useGetTokenMarketplaceInfo(
    marketplaceAddress,
    contractAddress,
    tokenId
  );

  const handleBuy = useCallback(async () => {
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

      // 1. First, create the timelock-ado contract for the artist's share
      const timelockMsg: Msg = {
        instantiate: {
          code_id: "YOUR_TIMELOCK_ADO_CODE_ID", // Replace with actual code ID
          msg: {
            beneficiary: artistAddress,
            release_time: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
          },
          label: "timelock-ado",
        },
      };

      // Instantiate the timelock contract
      const timelockResult = await client.execute("YOUR_TIMELOCK_ADO_INSTANTIATOR_ADDRESS", timelockMsg);
      const timelockAddress = timelockResult.contract_address;

      // 2. Create the split-ado contract with timelock for artist's share
      const splitMsg: Msg = {
        instantiate: {
          code_id: "YOUR_SPLIT_ADO_CODE_ID", // Replace with actual code ID
          msg: {
            beneficiaries: [
              {
                address: timelockAddress, // Artist's share goes to timelock
                share: "90", // 90%
              },
              {
                address: platformTreasuryAddress,
                share: "10", // 10%
              },
            ],
          },
          label: "split-ado",
        },
      };

      // Instantiate the split-ado contract
      const splitResult = await client.execute("YOUR_SPLIT_ADO_INSTANTIATOR_ADDRESS", splitMsg);
      const splitContractAddress = splitResult.contract_address;

      // 3. Create the buy message for the marketplace
      const buyMsg: Msg = {
        buy: {
          token_id: tokenId,
          token_address: contractAddress,
        },
      };

      // 4. Execute the buy transaction with the payment going to the split contract
      const price = marketplaceState?.latestSaleState.price;
      const denom = marketplaceState?.latestSaleState.coin_denom;
      
      if (!price || !denom) {
        throw new Error("Price or denom not available");
      }

      const payment = coin(price, denom);
      await client.execute(marketplaceAddress, buyMsg, undefined, [payment]);

      toast({
        title: "Success",
        description: "Purchase completed successfully! Artist's share will be available after 30 days.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Error",
        description: "Failed to complete purchase. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    client,
    marketplaceAddress,
    contractAddress,
    tokenId,
    artistAddress,
    platformTreasuryAddress,
    marketplaceState,
    toast,
  ]);

  return (
    <Button
      onClick={handleBuy}
      isLoading={isLoading}
      loadingText="Processing..."
      w="full"
      variant="solid"
      {...buttonProps}
    >
      Buy for {marketplaceState?.latestSaleState.price} {marketplaceState?.latestSaleState.coin_denom}
    </Button>
  );
} 