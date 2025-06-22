'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,      // How long data is considered fresh
        gcTime: 24 * 60 * 60 * 1000, // How long to persist/cache (24 hours)
        retry: 0,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  // for caching for 24 hrs in local storage
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
    });

    const [, persistPromise] = persistQueryClient({
      queryClient,
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) =>
          query.meta?.persist === true && query.state.status === 'success',
      },
    });

    persistPromise.then(() => {
      setIsRestored(true);
    });
  }, [queryClient]);

  if (!isRestored) return null; // Or a loading spinner


  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
      {/* </AuthProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
