"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface LoaderState {
  /** True once the preloader has revealed the page. */
  ready: boolean;
  setReady: (ready: boolean) => void;
}

const LoaderContext = createContext<LoaderState>({ ready: true, setReady: () => {} });

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <LoaderContext.Provider value={{ ready, setReady }}>{children}</LoaderContext.Provider>;
}

export function useLoader() {
  return useContext(LoaderContext);
}
