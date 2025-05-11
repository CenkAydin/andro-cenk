import React, { FC, ReactNode } from "react"
import Providers from "./providers";
import { Metadata } from "next";
import Header from "./components/Header";

export const metadata: Metadata = {
    title: {
        default: "Andromeda Embeddable",
        template: "%s | Embeddable"
    },
}

interface Props {
    children?: ReactNode;
}

const RootLayout = async (props: Props) => {
    const { children } = props;

    return (
        <html lang="en">
            <body>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout