"use client";

import { useGetTokenMarketplaceInfo } from "@/lib/graphql/hooks/marketplace";
import { useAndromedaStore } from "@/zustand/andromeda";
import {
  Button,
  ButtonProps,
  Progress,
  Text,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Msg } from "@andromedaprotocol/andromeda.js";
import { ExecuteResult, InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/proto-signing";

interface SupportArtistButtonProps extends ButtonProps {
  marketplaceAddress: string;
  contractAddress: string;
  tokenId: string;
  artistAddress: string;
  platformTreasuryAddress: string;
}

type PurchaseStep = "idle" | "buying" | "splitting" | "locking" | "confirming" | "complete" | "error";

export default function SupportArtistButton({
  marketplaceAddress,
  contractAddress,
  tokenId,
  artistAddress,
  platformTreasuryAddress,
  ...buttonProps
}: SupportArtistButtonProps) {
  const [currentStep, setCurrentStep] = useState<PurchaseStep>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [splitContractAddress, setSplitContractAddress] = useState<string>("");
  const [timelockAddress, setTimelockAddress] = useState<string>("");
  const toast = useToast();
  const { client } = useAndromedaStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { data: marketplaceState } = useGetTokenMarketplaceInfo(
    marketplaceAddress,
    contractAddress,
    tokenId
  );

  const getStepProgress = () => {
    switch (currentStep) {
      case "idle":
        return 0;
      case "buying":
        return 25;
      case "splitting":
        return 50;
      case "locking":
        return 75;
      case "confirming":
      case "complete":
        return 100;
      case "error":
        return 0;
      default:
        return 0;
    }
  };

  const getStepMessage = () => {
    switch (currentStep) {
      case "idle":
        return "Ready to support artist";
      case "buying":
        return "Purchasing NFT...";
      case "splitting":
        return "Setting up payment split...";
      case "locking":
        return "Configuring artist's share lock...";
      case "confirming":
        return "Confirming transaction...";
      case "complete":
        return "Support successful!";
      case "error":
        return `Error: ${errorMessage}`;
      default:
        return "";
    }
  };

  const handleRollback = useCallback(async () => {
    if (!client) return;

    try {
      // If we have a split contract, try to rollback the split
      if (splitContractAddress) {
        const rollbackMsg: Msg = {
          rollback: {},
        };
        await client.execute(splitContractAddress, rollbackMsg);
      }

      // If we have a timelock contract, try to rollback the timelock
      if (timelockAddress) {
        const rollbackMsg: Msg = {
          rollback: {},
        };
        await client.execute(timelockAddress, rollbackMsg);
      }
    } catch (error) {
      console.error("Rollback error:", error);
    }
  }, [client, splitContractAddress, timelockAddress]);

  const handleSupport = useCallback(async () => {
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
      onOpen();
      setCurrentStep("buying");
      setErrorMessage("");

      // Step 1: Buy NFT
      const buyMsg: Msg = {
        buy: {
          token_id: tokenId,
          token_address: contractAddress,
        },
      };

      const price = marketplaceState?.latestSaleState.price;
      const denom = marketplaceState?.latestSaleState.coin_denom;
      
      if (!price || !denom) {
        throw new Error("Price or denom not available");
      }

      const payment = coin(price, denom);
      await client.execute(marketplaceAddress, buyMsg, "auto", undefined, [payment]);

      // Step 2: Create timelock for artist's share
      setCurrentStep("locking");
      const timelockMsg: Msg = {
        instantiate: {
          code_id: "YOUR_TIMELOCK_ADO_CODE_ID",
          msg: {
            beneficiary: artistAddress,
            release_time: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
          },
          label: "timelock-ado",
        },
      };

      const timelockResult = await client.execute(
        "YOUR_TIMELOCK_ADO_INSTANTIATOR_ADDRESS",
        timelockMsg
      ) as InstantiateResult;
      setTimelockAddress(timelockResult.contractAddress);

      // Step 3: Create split contract
      setCurrentStep("splitting");
      const splitMsg: Msg = {
        instantiate: {
          code_id: "YOUR_SPLIT_ADO_CODE_ID",
          msg: {
            beneficiaries: [
              {
                address: timelockResult.contractAddress,
                share: "90",
              },
              {
                address: platformTreasuryAddress,
                share: "10",
              },
            ],
          },
          label: "split-ado",
        },
      };

      const splitResult = await client.execute(
        "YOUR_SPLIT_ADO_INSTANTIATOR_ADDRESS",
        splitMsg
      ) as InstantiateResult;
      setSplitContractAddress(splitResult.contractAddress);

      // Step 4: Confirm everything is set up
      setCurrentStep("confirming");
      // Add any additional confirmation steps here

      setCurrentStep("complete");
      toast({
        title: "Success",
        description: "Artist supported successfully! Their share will be available after 30 days.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Support error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setCurrentStep("error");
      
      // Attempt to rollback any completed steps
      await handleRollback();

      toast({
        title: "Error",
        description: "Failed to complete support. Rolling back changes...",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
    handleRollback,
    onOpen,
  ]);

  return (
    <>
      <Button
        onClick={handleSupport}
        isLoading={currentStep !== "idle" && currentStep !== "error"}
        loadingText="Supporting..."
        w="full"
        variant="solid"
        colorScheme="green"
        {...buttonProps}
      >
        Support Artist
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Supporting Artist</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Progress
                value={getStepProgress()}
                size="sm"
                colorScheme={currentStep === "error" ? "red" : "green"}
                hasStripe
                isAnimated
              />
              <Text textAlign="center" fontWeight="medium">
                {getStepMessage()}
              </Text>
              {currentStep === "error" && (
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setCurrentStep("idle");
                    onClose();
                  }}
                >
                  Close
                </Button>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 