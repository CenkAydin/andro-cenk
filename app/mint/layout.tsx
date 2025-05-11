'use client';

import React, { FC, ReactNode } from 'react';
import { Layout } from '@/modules/common/layout';
import { KEPLR_AUTOCONNECT_KEY, connectAndromedaClient, initiateKeplr, useAndromedaStore } from '@/zustand/andromeda';
import { useEffect } from 'react';

interface Props {
  children?: ReactNode;
}

const MintLayout: FC<Props> = ({ children }) => {
  const isConnected = useAndromedaStore(state => state.isConnected);
  const isLoading = useAndromedaStore(state => state.isLoading);
  const keplr = useAndromedaStore(state => state.keplr);

  useEffect(() => {
    initiateKeplr();
  }, []);

  useEffect(() => {
    const autoconnect = localStorage.getItem(KEPLR_AUTOCONNECT_KEY);
    if (!isLoading && typeof keplr !== "undefined" && autoconnect === keplr?.mode) {
      if (!isConnected) {
        connectAndromedaClient();
      }
    }
  }, [keplr, isConnected, isLoading]);

  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default MintLayout; 