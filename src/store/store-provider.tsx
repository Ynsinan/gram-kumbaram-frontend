"use client";

import { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const store = useMemo(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
};
