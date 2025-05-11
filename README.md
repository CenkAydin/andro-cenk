# Andromeda NFT Marketplace

A full-featured NFT marketplace built on the Andromeda Protocol, enabling users to mint, trade, and manage NFTs with a modern, responsive interface.

## Project Description

This NFT marketplace leverages the Andromeda Protocol to provide a seamless experience for creating, trading, and managing NFTs. Built with Next.js and TypeScript, it offers a robust platform for both creators and collectors, featuring IPFS integration for decentralized storage and a user-friendly interface powered by Chakra UI.

## Key Features

- **NFT Minting**

  - Direct minting through CW721 contracts
  - IPFS integration for decentralized image storage
  - Custom metadata support
  - Real-time transaction feedback

- **User Dashboard**

  - View owned NFTs in a responsive grid layout
  - Search functionality for quick NFT discovery
  - Detailed NFT information display
  - Transaction history

- **Collection Management**

  - Collection detail pages
  - NFT listing and management
  - Collection metadata display
  - Owner verification

- **Auction System**

  - Real-time auction interface
  - Bid management
  - Price tracking
  - Auction status updates

- **User Experience**
  - Dark/Light mode toggle
  - Responsive design
  - Toast notifications for user feedback
  - Loading states and error handling

## Additional Features

- **IPFS Integration**

  - Automatic image upload to IPFS
  - CID generation and management
  - Fallback image handling
  - Metadata storage

- **Wallet Integration**
  - Andromeda wallet support
  - Transaction signing
  - Balance checking
  - Network status monitoring

## Project Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/andromeda-nft-marketplace.git
   cd andromeda-nft-marketplace
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

## Future Scope

### Planned Features

- Multi-wallet support (Keplr, Cosmostation)
- Advanced search and filtering
- Social features (likes, comments, sharing)
- Analytics dashboard
- Batch minting support
- Royalty management
- Collection verification system

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
