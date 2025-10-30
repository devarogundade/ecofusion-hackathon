import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface Achievement {
  title: string;
  description: string;
  xp: number;
}

interface AppContextType {
  // account
  isConnected: boolean;
  accountId: string;
  isLoading: boolean;
  setConnected: (state: boolean) => void;
  setAccountId: (value: string) => void;
  setLoading: (state: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isConnected, setConnected] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [isLoading, setLoading] = useState(false);

  const value: AppContextType = useMemo(
    () => ({
      isConnected,
      accountId,
      isLoading,
      setConnected,
      setAccountId,
      setLoading,
    }),
    [isConnected, accountId, isLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
