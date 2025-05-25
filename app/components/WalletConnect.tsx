"use client";

import { useChain } from "@cosmos-kit/react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  HStack,
  Avatar,
  Select,
} from "@chakra-ui/react";
import { Wallet } from "lucide-react";
import { useState } from "react";

const CHAINS = [
  { chain_name: "elgafar", label: "Elgafar Testnet" }
];

export default function WalletConnect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChain, setSelectedChain] = useState<string>(CHAINS[0].chain_name);
  const { connect, disconnect, status, address, chain } = useChain(selectedChain);

  const handleConnect = async () => {
    try {
      await connect();
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const isWalletConnected = status === "Connected";

  if (isWalletConnected && address) {
    return (
      <HStack spacing={3}>
        <Avatar size="sm" name={address} />
        <Text fontSize="sm" fontWeight="500">
          {address.slice(0, 6)}...{address.slice(-4)}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {chain?.pretty_name || chain?.chain_name}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDisconnect}
          className="btn-ghost"
        >
          Disconnect
        </Button>
      </HStack>
    );
  }

  return (
    <>
      <Button
        leftIcon={<Wallet size={16} />}
        onClick={onOpen}
        className="btn-outline"
      >
        Connect Wallet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent className="modal-content">
          <ModalHeader className="text-serif">Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text color="gray.600">
                Select a chain and connect your wallet
              </Text>
              <Select
                placeholder="Select chain"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
              >
                {CHAINS.map((c) => (
                  <option key={c.chain_name} value={c.chain_name}>
                    {c.label}
                  </option>
                ))}
              </Select>
              <Button
                onClick={handleConnect}
                className="btn-outline"
                size="lg"
                width="full"
                isDisabled={!selectedChain}
              >
                Connect with Keplr
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 