"use client";

import { createContext, useContext, useEffect, useState } from "react";
import client from "@/app/api/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<{ user: any | null; loading: boolean }>({ user: null, loading: true });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
