"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import LoadingPage from "./LoadingPage";

interface NavigationLoaderContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType | undefined>(undefined);

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <NavigationLoaderContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingPage />}
      {children}
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);
  if (context === undefined) {
    throw new Error("useNavigationLoader must be used within a NavigationLoaderProvider");
  }
  return context;
}
