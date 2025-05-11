import { cache } from 'react'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { IConfig } from '../app/types';

const ELGAFAR_RPC = 'https://rpc.elgafar.andromeda-testnet.io';
const ELGAFAR_KERNEL = ''; // If you have a kernel address, put it here

export const getClient = cache(async (_chainId: string) => {
    // Always use the hardcoded Andromeda testnet RPC
    const client = await CosmWasmClient.connect(ELGAFAR_RPC);
    return client;
})

export const getEmbeddableAddress = cache(async (client: CosmWasmClient) => {
    // If you have a hardcoded kernel address, return it here
    return ELGAFAR_KERNEL;
})

export const getConfig = cache(async (client: CosmWasmClient, key: string) => {
    const chainId = await client.getChainId();
    if (key === APP_ENV.DEFAULT_CONFIG.id && chainId === APP_ENV.DEFAULT_CONFIG.chainId) return APP_ENV.DEFAULT_CONFIG;
    const query: IGetKeyQuery = {
        "get_value": {
            "key": key
        }
    }
    const db = await getEmbeddableAddress(client);
    console.log(db, chainId, "DB");
    const rawConfig: IGetKeyQueryResponse = await client.queryContractSmart(db, query);
    const config: IConfig = JSON.parse(rawConfig.value.string);
    config.id = key;
    return config;
})

export const getAllApps = cache(async (client: CosmWasmClient) => {
    const chainId = await client.getChainId();
    const query: IAllKeysQuery = {
        "all_keys": {
        }
    }
    const db = await getEmbeddableAddress(client);
    console.log(db, chainId, "DB");
    const keys: IAllKeysQueryResponse = await client.queryContractSmart(db, query);
    return keys;
})