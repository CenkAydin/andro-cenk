# Andromeda Creator Support Platform

A decentralized platform that enables artists to monetize their work through NFTs while receiving direct support from their audience. Built on the Andromeda Protocol, this platform combines NFT ownership with a sustainable revenue model for creators.

## Project Description

This platform allows artists to mint their works as NFTs and receive support from their audience. Supporters can purchase these NFTs, gaining digital ownership and access to exclusive content, while also supporting the artist financially. The platform uses smart contracts to automatically handle revenue distribution and implement a time-locked release mechanism for artist payments.

## Key Features

- **Artist-Centric NFT Minting**

  - Direct minting through CW721-ADO contracts
  - IPFS integration for artwork storage
  - Custom metadata support for artwork details
  - Automatic revenue splitting between artist and platform

- **Revenue Management**

  - Automatic 90/10 revenue split (artist/platform)
  - Time-locked artist payments for sustainable income
  - Transparent payment tracking
  - Claimable funds dashboard

- **Artist Dashboard**

  - Sales analytics and revenue tracking
  - Locked/unlocked funds overview
  - NFT portfolio management
  - Support metrics and audience insights

- **Public Gallery**

  - Curated artwork showcase
  - Artist profiles and portfolios
  - Featured creators section
  - Search and filter capabilities

- **User Experience**
  - Dark/Light mode toggle
  - Responsive design
  - Toast notifications for transactions
  - Loading states and error handling

## Additional Features

- **Smart Contract Integration**

  - CW721-ADO for NFT management
  - Split-ADO for revenue distribution
  - Timelock-ADO for payment scheduling
  - Automated contract interactions

- **IPFS Integration**
  - Automatic artwork upload to IPFS
  - CID generation and management
  - Fallback image handling
  - Metadata storage

## Project Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/CenkAydin/andro-cenk.git
   cd andro-cenk
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with the following variables:

   ```env
   NEXT_PUBLIC_WEB3STORAGE_TOKEN=your_web3storage_token
   NEXT_PUBLIC_ANDROMEDA_RPC=your_andromeda_rpc_url
   NEXT_PUBLIC_ANDROMEDA_REST=your_andromeda_rest_url
   NEXT_PUBLIC_PLATFORM_FEE_ADDRESS=your_platform_wallet_address
   NEXT_PUBLIC_REVENUE_SPLIT_RATIO=90 # Percentage for artist
   NEXT_PUBLIC_TIMELOCK_DURATION=2592000 # 30 days in seconds
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Technical Requirements

- Node.js 16.x or higher
- Andromeda wallet (for testing)
- Web3.Storage account (for IPFS)
- Andromeda testnet tokens

## Smart Contract Architecture

### Core ADOs

- **CW721-ADO**: Handles NFT minting and ownership
- **Split-ADO**: Manages revenue distribution between artist and platform
- **Timelock-ADO**: Controls the release schedule of artist payments

### Contract Flow

1. Artist mints NFT using CW721-ADO
2. Buyer purchases NFT
3. Split-ADO automatically distributes funds (90% artist, 10% platform)
4. Timelock-ADO locks artist's share for specified duration
5. Artist can claim funds after lock period

## Future Scope

### Planned Features

- Multi-wallet support (Keplr, Cosmostation)
- Advanced analytics for artists
- Social features (comments, sharing)
- Batch artwork upload
- Royalty management
- Artist verification system

### Technical Improvements

- IPFS pinning optimization
- Transaction batching
- Caching layer implementation
- Performance optimizations
- Enhanced error handling
- Automated testing suite

### UI/UX Enhancements

- Custom theme builder
- Advanced sorting options
- Mobile app version
- Enhanced loading animations
- Accessibility improvements
- Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Andromeda Protocol team
- Chakra UI
- Web3.Storage
- Next.js team
- Cosmos SDK community
