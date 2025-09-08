'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  token: string | null;
  login: (_Token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);


  useEffect(() => {
    const publicPaths = ["/login", "/signup", "/otpverify", "/forgot", "/forgetotpverify", "/forgetreset", "/message"];
    if (token && publicPaths.includes(pathname)) {
      
      router.push("/");
    } else if (!token && !publicPaths.includes(pathname)) {
    
      router.push("/login");
    }
  }, [token, pathname, router]);

   const login = async (newToken: string) => {
    setLoading(true); 
    try {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      router.push("/"); 
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login"); 
  };
  

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
