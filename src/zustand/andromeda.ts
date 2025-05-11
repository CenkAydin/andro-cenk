"use client";
import { APP_ENV } from "@/appEnv";
import AndromedaClient from "@andromedaprotocol/andromeda.js";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import type { AccountData, Keplr } from "@keplr-wallet/types";
import { create } from "zustand";

export enum KeplrConnectionStatus {
    Ok,
    NotInstalled,
    Connecting
}

export interface IAndromedaStore {
    client?: AndromedaClient;
    chainId: string;
    isConnected: boolean;
    keplr: Keplr | undefined;
    keplrStatus: KeplrConnectionStatus
    accounts: Readonly<AccountData[]>;
    autoconnect: boolean;
    isLoading: boolean;
}

export const useAndromedaStore = create<IAndromedaStore>((set, get) => ({
    client: undefined,
    chainId: APP_ENV.DEFAULT_CONFIG.chainId,
    isConnected: false,
    keplr: undefined,
    accounts: [],
    keplrStatus: KeplrConnectionStatus.NotInstalled,
    autoconnect: false,
    isLoading: false
}))

export const resetAndromedaStore = () => {
    useAndromedaStore.setState({
        client: undefined,
        chainId: APP_ENV.DEFAULT_CONFIG.chainId,
        isConnected: false,
        keplr: undefined,
        accounts: [],
        keplrStatus: KeplrConnectionStatus.NotInstalled,
        autoconnect: false,
        isLoading: false
    })
}

export const KEPLR_AUTOCONNECT_KEY = "keplr_autoconnect";

const ANDROMEDA_CHAIN_INFO = {
  chainId: 'andromeda-1',
  chainName: 'Andromeda',
  rpc: 'https://rpc.andromeda-1.andromeda.aviaone.com',
  rest: 'https://api.andromeda-1.andromeda.aviaone.com/',
  bech32Config: {
    bech32PrefixAccAddr: 'andr',
    bech32PrefixAccPub: 'andrpub',
    bech32PrefixValAddr: 'andrvaloper',
    bech32PrefixValPub: 'andrvaloperpub',
    bech32PrefixConsAddr: 'andrvalcons',
    bech32PrefixConsPub: 'andrvalconspub',
  },
  bip44: {
    coinType: 118,
  },
  currencies: [{ coinDenom: 'ANDR', coinMinimalDenom: 'uandr', coinDecimals: 6 }],
  feeCurrencies: [{ coinDenom: 'ANDR', coinMinimalDenom: 'uandr', coinDecimals: 6 }],
  stakeCurrency: { coinDenom: 'ANDR', coinMinimalDenom: 'uandr', coinDecimals: 6 },
  gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 },
  chainSymbolImageUrl: '',
};

const ANDROMEDA_RPC_ENDPOINTS = [
  'https://andro.rpc.m.stavr.tech/',
  'https://andromeda-rpc.stakerhouse.com:443',
];

async function getWorkingAndromedaRpc() {
  let lastError: any = undefined;
  for (const rpc of ANDROMEDA_RPC_ENDPOINTS) {
    try {
      const client = await import('@cosmjs/cosmwasm-stargate').then(m => m.CosmWasmClient.connect(rpc));
      await client.getChainId();
      return rpc;
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error('All Andromeda RPC endpoints failed. Last error: ' + (lastError?.message || String(lastError)));
}

export const connectAndromedaClient = async () => {
  const chainId = 'andromeda-1';
  try {
    window.addEventListener('keplr_keystorechange', keplrKeystoreChange);
    const state = useAndromedaStore.getState();
    if (state.isLoading) return;
    useAndromedaStore.setState({ isLoading: true });

    const keplr = window.keplr;
    if (!keplr) throw new Error('Keplr not instantiated yet');

    keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true,
      },
    };

    // Always suggest andromeda-1 chain before enabling
    await keplr.experimentalSuggestChain(ANDROMEDA_CHAIN_INFO);
    await keplr.enable(chainId);

    const config = ANDROMEDA_CHAIN_INFO;
    const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
    const accounts = await offlineSigner.getAccounts();
    const client = state.client || new (await import('@andromedaprotocol/andromeda.js')).default();
    const workingRpc = await getWorkingAndromedaRpc();
    await client.connect(
      workingRpc,
      '', // kernelAddress (if needed, add to config)
      config.bech32Config.bech32PrefixAccAddr,
      offlineSigner as any,
      { gasPrice: GasPrice.fromString('0.025uandr') }
    );
    localStorage.setItem(KEPLR_AUTOCONNECT_KEY, keplr?.mode ?? 'extension');
    useAndromedaStore.setState({
      accounts,
      chainId,
      isConnected: true,
      keplr: keplr,
      keplrStatus: KeplrConnectionStatus.Ok,
      autoconnect: true,
      isLoading: false,
      client: client,
    });
  } catch (err) {
    useAndromedaStore.setState({ isLoading: false });
    throw err;
  }
};

export const disconnectAndromedaClient = () => {
    window.removeEventListener("keplr_keystorechange", keplrKeystoreChange);
    localStorage.removeItem(KEPLR_AUTOCONNECT_KEY);
    useAndromedaStore.setState({
        isConnected: false,
        accounts: [],
        autoconnect: false
    })
}

const keplrKeystoreChange = async () => {
    const state = useAndromedaStore.getState();
    if (state.autoconnect) {
        await connectAndromedaClient()
    }
}

/**
 * https://docs.keplr.app/api/
 * Taken from above
 */
export function initiateKeplr() {
    if (window.keplr) {
        useAndromedaStore.setState({ keplrStatus: KeplrConnectionStatus.Ok, keplr: window.keplr })
        return;
    }
    if (document.readyState === "complete") {
        useAndromedaStore.setState({ keplrStatus: KeplrConnectionStatus.NotInstalled, keplr: undefined })
        return;
    }
    useAndromedaStore.setState({ keplrStatus: KeplrConnectionStatus.Connecting })
    const documentStateChange = (event: Event) => {
        if (
            event.target &&
            (event.target as Document).readyState === "complete"
        ) {
            if (window.keplr) {
                useAndromedaStore.setState({ keplrStatus: KeplrConnectionStatus.Ok, keplr: window.keplr })
            } else {
                useAndromedaStore.setState({ keplrStatus: KeplrConnectionStatus.NotInstalled, keplr: undefined })
            }
            document.removeEventListener("readystatechange", documentStateChange);
        }
    };
    document.addEventListener("readystatechange", documentStateChange);
}