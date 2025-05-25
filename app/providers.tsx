"use client"

import { apolloClient } from "@/lib/graphql";
import reactQueryClient from "@/lib/react-query/client";
import { GlobalModalProvider } from "@/modules/modals";
import theme, { ThemeStorageManager } from "@/theme";
import { ApolloProvider } from "@apollo/client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient } from "@cosmjs/stargate";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { FC, ReactNode } from "react"

interface Props {
    children?: ReactNode;
}

export const Providers: FC<Props> = ({ children }) => {
    return (
        <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={reactQueryClient}>
                <CacheProvider>
                    <ChakraProvider theme={theme} colorModeManager={ThemeStorageManager}>
                        <GlobalModalProvider>
                            {children}
                        </GlobalModalProvider>
                    </ChakraProvider>
                </CacheProvider>
            </QueryClientProvider>
        </ApolloProvider>
    )
}

export default Providers