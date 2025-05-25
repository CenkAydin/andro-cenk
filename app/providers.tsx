"use client"

import { ChakraProvider } from "@chakra-ui/react";
import { wallets } from "@cosmos-kit/keplr";
import { ChainProvider } from "@cosmos-kit/react";
import { defaultTheme } from "./theme";
import { Registry } from "@cosmjs/proto-signing";
import { AminoTypes } from "@cosmjs/stargate";
import { chains, assets } from "chain-registry";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";

// Create Apollo Client instance
const httpLink = new HttpLink({
  uri: "https://api.elgafar-1.andromeda.aviaone.com/graphql",
  credentials: "same-origin",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

// Define supported chains
const supportedChains = [
  {
    chain_id: "elgafar-1",
    chain_name: "elgafar",
    pretty_name: "Elgafar",
    network_type: "testnet" as const,
    status: "live" as const,
    bech32_prefix: "andr",
    daemon_name: "andromedad",
    node_home: "$HOME/.andromedad",
    key_algos: ["secp256k1" as const],
    slip44: 118,
    chain_type: "cosmos" as const,
    fees: {
      fee_tokens: [
        {
          denom: "uandr",
          fixed_min_gas_price: 0,
          low_gas_price: 0,
          average_gas_price: 0.01,
          high_gas_price: 0.02,
        },
      ],
    },
    staking: {
      staking_tokens: [
        {
          denom: "uandr",
        },
      ],
    },
    codebase: {
      git_repo: "https://github.com/andromedaprotocol/andromedad",
      recommended_version: "v0.1.0",
      compatible_versions: ["v0.1.0"],
    },
    apis: {
      rpc: [
        {
          address: "https://rpc.elgafar-1.andromeda.aviaone.com",
          provider: "Andromeda",
        },
      ],
      rest: [
        {
          address: "https://api.elgafar-1.andromeda.aviaone.com",
          provider: "Andromeda",
        },
      ],
    },
    explorers: [
      {
        kind: "ping.pub",
        url: "https://explorer.andromeda.aviaone.com/elgafar-1",
        tx_page: "https://explorer.andromeda.aviaone.com/elgafar-1/tx/${txHash}",
      },
    ],
  },
];

// Define supported assets
const supportedAssets = [
  {
    chain_name: "elgafar",
    assets: [
      {
        description: "The native token of Andromeda",
        denom_units: [
          {
            denom: "uandr",
            exponent: 0,
          },
          {
            denom: "andr",
            exponent: 6,
          },
        ],
        base: "uandr",
        name: "Andromeda",
        display: "andr",
        symbol: "ANDR",
        type_asset: "sdk.coin" as const,
        logo_URIs: {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/andromeda/images/andromeda.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/andromeda/images/andromeda.svg",
        },
        coingecko_id: "andromeda",
      },
    ],
  },
];

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={defaultTheme}>
        <ChainProvider
          chains={supportedChains}
          assetLists={supportedAssets}
          wallets={wallets}
          signerOptions={{
            signingStargate: () => ({
              aminoTypes: new AminoTypes({}),
              registry: new Registry(),
            }),
          }}
          throwErrors={false}
          defaultNameService="icns"
          endpointOptions={{
            endpoints: {
              "elgafar": {
                rpc: ["https://rpc.elgafar-1.andromeda.aviaone.com"],
                rest: ["https://api.elgafar-1.andromeda.aviaone.com"],
              },
            },
          }}
        >
          {children}
        </ChainProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}