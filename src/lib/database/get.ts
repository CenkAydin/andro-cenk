import { cache } from 'react'
import { apolloClient } from '../graphql'
import { IChainConfigQuery, refetchChainConfigQuery } from '@andromedaprotocol/gql/dist/__generated/react'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { APP_ENV } from '@/appEnv';
import { IAllKeysQuery, IAllKeysQueryResponse, IGetKeyQuery, IGetKeyQueryResponse, IKernelKeyQuery } from './types';
import { IConfig } from '../app/types';

const DEFAULT_CHAIN_ID = 'elgafar-1';

export const getClient = cache(async (chainId: string) => {
    if (!chainId) {
        console.warn('No chainId provided, using default:', DEFAULT_CHAIN_ID);
        chainId = DEFAULT_CHAIN_ID;
    }

    console.log('Initializing client for chain:', chainId);

    try {
        const config = await apolloClient.query<IChainConfigQuery>(refetchChainConfigQuery({ identifier: chainId }));
        
        if (!config.data?.chainConfigs?.config) {
            console.warn(`Chain config not found for ID: ${chainId}, falling back to default`);
            const defaultConfig = await apolloClient.query<IChainConfigQuery>(refetchChainConfigQuery({ identifier: DEFAULT_CHAIN_ID }));
            
            if (!defaultConfig.data?.chainConfigs?.config) {
                throw new Error('Default chain configuration not found');
            }
            
            console.log('Using default chain URL:', defaultConfig.data.chainConfigs.config.chainUrl);
            const client = await CosmWasmClient.connect(defaultConfig.data.chainConfigs.config.chainUrl);
            return client;
        }

        console.log('Connecting to chain URL:', config.data.chainConfigs.config.chainUrl);
        const client = await CosmWasmClient.connect(config.data.chainConfigs.config.chainUrl);
        return client;
    } catch (error: any) {
        console.error('Error initializing client:', error);
        throw new Error(`Failed to initialize client: ${error?.message || 'Unknown error'}`);
    }
})

export const getEmbeddableAddress = cache(async (client: CosmWasmClient) => {
    try {
        const query: IKernelKeyQuery = {
            "key_address": {
                "key": "embeddables"
            }
        }
        const chainId = await client.getChainId();
        console.log('Getting embeddable address for chain:', chainId);

        if (APP_ENV.OVERRIDE_DATABASE[chainId]) {
            console.log('Using override database for chain:', chainId);
            return APP_ENV.OVERRIDE_DATABASE[chainId];
        }
        
        const config = await apolloClient.query<IChainConfigQuery>(refetchChainConfigQuery({ identifier: chainId }));
        if (!config.data?.chainConfigs?.config) {
            throw new Error(`Chain configuration not found for chainId: ${chainId}`);
        }

        const key: string = await client.queryContractSmart(config.data.chainConfigs.config.kernelAddress, query);
        return key;
    } catch (error: any) {
        console.error('Error getting embeddable address:', error);
        throw new Error(`Failed to get embeddable address: ${error?.message || 'Unknown error'}`);
    }
})

export const getConfig = cache(async (client: CosmWasmClient, key: string) => {
    try {
        const chainId = await client.getChainId();
        console.log('Getting config for chain:', chainId, 'key:', key);

        if (key === APP_ENV.DEFAULT_CONFIG.id && chainId === APP_ENV.DEFAULT_CONFIG.chainId) {
            console.log('Using default config');
            return APP_ENV.DEFAULT_CONFIG;
        }
        
        const query: IGetKeyQuery = {
            "get_value": {
                "key": key
            }
        }
        const db = await getEmbeddableAddress(client);
        console.log('Database address:', db);
        
        const rawConfig: IGetKeyQueryResponse = await client.queryContractSmart(db, query);
        const config: IConfig = JSON.parse(rawConfig.value.string);
        config.id = key;
        return config;
    } catch (error: any) {
        console.error('Error getting config:', error);
        throw new Error(`Failed to get configuration: ${error?.message || 'Unknown error'}`);
    }
})

export const getAllApps = cache(async (client: CosmWasmClient) => {
    try {
        const chainId = await client.getChainId();
        console.log('Getting all apps for chain:', chainId);

        const query: IAllKeysQuery = {
            "all_keys": {}
        }
        const db = await getEmbeddableAddress(client);
        console.log('Database address:', db);

        const keys: IAllKeysQueryResponse = await client.queryContractSmart(db, query);
        return keys;
    } catch (error: any) {
        console.error('Error getting all apps:', error);
        throw new Error(`Failed to get all apps: ${error?.message || 'Unknown error'}`);
    }
})