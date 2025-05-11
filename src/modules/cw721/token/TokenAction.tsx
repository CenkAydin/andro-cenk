import { ICollectionCw721, ICollectionType, IAuctionCollection } from "@/lib/app/types";
import { useGetCw721, useGetCw721Token } from "@/lib/graphql/hooks/cw721";
import AuctionInfo from "@/modules/auction/AuctionInfo";
import CrowdfundInfo from "@/modules/crowdfund/CrowdfundInfo";
import MarketplaceInfo from "@/modules/marketplace/MarketplaceInfo";
import React, { FC } from "react"
import { useGetTokenAuctionState } from '@/lib/graphql/hooks/auction/useGetTokenAuctionState';
import { Button, Box, Text, VStack, HStack, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';

interface Props {
    collection: ICollectionCw721;
    tokenId: string;
}

const Cw721TokenAction: FC<Props> = (props) => {
    const { collection, tokenId } = props;
    const { data: cw721 } = useGetCw721(collection.cw721);
    const { data: token } = useGetCw721Token(collection.cw721, tokenId)

    if (collection.type === ICollectionType.AUCTION) {
        const auctionCollection = collection as IAuctionCollection;
        const { data: auction, loading } = useGetTokenAuctionState(auctionCollection.auction, auctionCollection.cw721, tokenId);
        const [bidAmount, setBidAmount] = useState('');
        const [isBidding, setIsBidding] = useState(false);
        const toast = useToast();

        const handleBid = async () => {
            setIsBidding(true);
            try {
                // TODO: Implement bid transaction logic here
                toast({ title: 'Bid placed (mock)', status: 'success' });
            } catch (err) {
                toast({ title: 'Failed to place bid', status: 'error' });
            } finally {
                setIsBidding(false);
            }
        };

        return (
            <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
                <VStack align="stretch" spacing={4}>
                    <Text fontWeight="bold">Auction Status</Text>
                    {loading ? (
                        <Text>Loading auction info...</Text>
                    ) : auction ? (
                        <>
                            <HStack>
                                <Text>Floor Price:</Text>
                                <Text fontWeight="bold">{auction.min_bid} {auction.coin_denom}</Text>
                            </HStack>
                            <HStack>
                                <Text>Highest Bid:</Text>
                                <Text fontWeight="bold">{auction.high_bidder_amount} {auction.coin_denom}</Text>
                            </HStack>
                            <HStack>
                                <Text>Time Left:</Text>
                                <Text fontWeight="bold">{auction.end_time ?? 'N/A'}</Text>
                            </HStack>
                            <HStack>
                                <Input
                                    placeholder="Your bid amount"
                                    value={bidAmount}
                                    onChange={e => setBidAmount(e.target.value)}
                                    size="sm"
                                    width="120px"
                                />
                                <Button
                                    size="sm"
                                    colorScheme="purple"
                                    isLoading={isBidding}
                                    onClick={handleBid}
                                >
                                    Place Bid
                                </Button>
                            </HStack>
                        </>
                    ) : (
                        <Text>No auction found for this NFT.</Text>
                    )}
                </VStack>
            </Box>
        );
    }
    if (collection.type === ICollectionType.MARKETPLACE) return (
        <MarketplaceInfo
            collection={collection}
            collectionName={cw721?.contractInfo.name ?? 'Loading...'}
            tokenId={tokenId}
            name={token?.metadata?.name ?? tokenId}
        />
    )
    if (collection.type === ICollectionType.CROWDFUND) return (
        <CrowdfundInfo
            collection={collection}
            collectionName={cw721?.contractInfo.name ?? 'Loading...'}
        />
    )
    return null;
}

export default Cw721TokenAction