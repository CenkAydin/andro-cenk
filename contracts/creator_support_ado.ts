import { AndromedaClient, ExecuteMsg, QueryMsg } from '@andromedaprotocol/andromeda.js';

export interface CreatorSupportConfig {
  platform_fee_address: string;
  revenue_split_ratio: number; // Percentage for artist (e.g., 90)
  timelock_duration: number; // Duration in seconds
}

export interface MintArtworkMsg {
  token_id: string;
  owner: string;
  token_uri: string;
  extension: {
    name: string;
    description: string;
    image: string;
  };
}

export interface PurchaseArtworkMsg {
  token_id: string;
  buyer: string;
  price: string; // Amount in uandr
}

export class CreatorSupportADO {
  private client: AndromedaClient;
  private contractAddress: string;
  private config: CreatorSupportConfig;

  constructor(
    client: AndromedaClient,
    contractAddress: string,
    config: CreatorSupportConfig
  ) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = config;
  }

  async mintArtwork(msg: MintArtworkMsg): Promise<string> {
    const executeMsg: ExecuteMsg = {
      mint_artwork: {
        token_id: msg.token_id,
        owner: msg.owner,
        token_uri: msg.token_uri,
        extension: msg.extension,
      },
    };

    const result = await this.client.executeContract(
      this.contractAddress,
      executeMsg
    );
    return result.transactionHash;
  }

  async purchaseArtwork(msg: PurchaseArtworkMsg): Promise<string> {
    const executeMsg: ExecuteMsg = {
      purchase_artwork: {
        token_id: msg.token_id,
        buyer: msg.buyer,
        price: msg.price,
      },
    };

    const result = await this.client.executeContract(
      this.contractAddress,
      executeMsg
    );
    return result.transactionHash;
  }

  async claimArtistFunds(artist: string): Promise<string> {
    const executeMsg: ExecuteMsg = {
      claim_artist_funds: {
        artist,
      },
    };

    const result = await this.client.executeContract(
      this.contractAddress,
      executeMsg
    );
    return result.transactionHash;
  }

  async getArtistBalance(artist: string): Promise<{
    locked: string;
    unlocked: string;
  }> {
    const queryMsg: QueryMsg = {
      artist_balance: {
        artist,
      },
    };

    const result = await this.client.queryContract(
      this.contractAddress,
      queryMsg
    );
    return result;
  }

  async getArtworkDetails(tokenId: string): Promise<{
    owner: string;
    token_uri: string;
    extension: {
      name: string;
      description: string;
      image: string;
    };
  }> {
    const queryMsg: QueryMsg = {
      artwork_details: {
        token_id: tokenId,
      },
    };

    const result = await this.client.queryContract(
      this.contractAddress,
      queryMsg
    );
    return result;
  }
} 