import React, { FC, ReactNode } from "react"
import Providers from "./providers";
import { Metadata } from "next";
import Header from "./components/Header";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ArtMecra - Digital Art Patronage Platform',
    description: 'Discover and support emerging digital artists through ArtMecra, the premier platform for digital art patronage and collection.',
    keywords: 'digital art, art patronage, NFT, artist support, digital artists, art collection',
    authors: [{ name: 'ArtMecra Team' }],
    openGraph: {
        title: 'ArtMecra - Digital Art Patronage Platform',
        description: 'Discover and support emerging digital artists through ArtMecra, the premier platform for digital art patronage and collection.',
        url: 'https://artmecra.com',
        siteName: 'ArtMecra',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'ArtMecra - Digital Art Patronage Platform',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ArtMecra - Digital Art Patronage Platform',
        description: 'Discover and support emerging digital artists through ArtMecra, the premier platform for digital art patronage and collection.',
        images: ['/twitter-image.jpg'],
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    themeColor: '#FDFBF7',
}

interface Props {
    children?: ReactNode;
}

const RootLayout = async (props: Props) => {
    const { children } = props;

    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout