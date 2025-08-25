import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (sessionId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
