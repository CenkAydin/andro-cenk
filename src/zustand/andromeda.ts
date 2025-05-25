"use client";
import { APP_ENV } from "@/appEnv";
import { apolloClient } from "@/lib/graphql";
import AndromedaClient from "@andromedaprotocol/andromeda.js";
import { refetchChainConfigQuery, refetchKeplrConfigQuery, IChainConfigQuery, IKeplrConfigQuery } from "@andromedaprotocol/gql/dist/__generated/react";
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

export const connectAndromedaClient = async (chainId?: string | null) => {
    try {
        window.addEventListener("keplr_keystorechange", keplrKeystoreChange);

        const state = useAndromedaStore.getState();
        if (state.isLoading) return;
        useAndromedaStore.setState({ isLoading: true })
        chainId = chainId || state.chainId;

        console.log(chainId, "CHAIN ID");

        const keplr = state.keplr;
        if (!keplr) throw new Error("Keplr not instantiated yet");

        keplr.defaultOptions = {
            sign: {
                preferNoSetFee: true,
            }
        }

        try {
            await keplr.enable(chainId)
        } catch (err) {
            console.log("Failed to enable chain, attempting to suggest chain...");
            try {
                const keplrConfig = await apolloClient.query<IKeplrConfigQuery>(refetchKeplrConfigQuery({
                    'identifier': chainId
                }))
                await keplr.experimentalSuggestChain(keplrConfig.data.keplrConfigs.config);
                await keplr.enable(chainId);
            } catch (suggestErr) {
                console.error("Failed to suggest chain:", suggestErr);
                throw new Error("Failed to configure chain in Keplr");
            }
        }

        let config;
        try {
            const chainConfigResponse = await apolloClient.query<IChainConfigQuery>(refetchChainConfigQuery({
                'identifier': chainId
            }));
            config = chainConfigResponse.data.chainConfigs.config;
        } catch (configErr) {
            console.error("Failed to fetch chain config:", configErr);
            throw new Error("Failed to fetch chain configuration");
        }

        if (!config) {
            throw new Error("Chain configuration not found");
        }

        const signer = await keplr.getOfflineSignerAuto(config.chainId);
        const accounts = await signer.getAccounts();

        // This is needed because there is some ssr error with andromeda client creation
        const client = state.client || new (await import("@andromedaprotocol/andromeda.js")).default()
        await client.connect(config.chainUrl,
            config.kernelAddress,
            config.addressPrefix,
            signer as any,
            { gasPrice: GasPrice.fromString(config.defaultFee) });
        localStorage.setItem(KEPLR_AUTOCONNECT_KEY, keplr?.mode ?? "extension");

        useAndromedaStore.setState({
            accounts,
            chainId,
            isConnected: true,
            keplr: keplr,
            keplrStatus: KeplrConnectionStatus.Ok,
            autoconnect: true,
            isLoading: false,
            client: client
        })
    } catch (err) {
        console.error("Failed to connect Andromeda client:", err);
        useAndromedaStore.setState({ 
            isLoading: false,
            keplrStatus: KeplrConnectionStatus.NotInstalled,
            isConnected: false
        });
        throw err;
    }
}

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