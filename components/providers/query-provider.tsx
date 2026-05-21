"use client"

import { useState, type ReactNode } from "react"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

const ONE_MINUTE = 1000 * 60
const ONE_HOUR = ONE_MINUTE * 60

const noopStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
}

const createPersister = () =>
  createSyncStoragePersister({
    storage: typeof window !== "undefined" ? window.localStorage : noopStorage,
    key: "citnurse-query-cache",
  })

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: ONE_MINUTE,
            gcTime: ONE_HOUR,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      }),
  )

  const [persister] = useState(createPersister)

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_HOUR,
        buster: "v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
