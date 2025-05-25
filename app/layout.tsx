import { Metadata } from "next";
import ClientLayout from "./components/ClientLayout";

export const metadata: Metadata = {
    title: "CanvasPatron - NFT Marketplace",
    description: "Support artists and collect NFTs on CanvasPatron",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}