"use client";

import { createContext, useContext } from "react";
import type { User } from "@/shared/types/user";

type Ctx = {
  user: User;
  signOut: () => void;
};

const UserContext = createContext<Ctx | null>(null);

export function UserProvider({
  user,
  signOut,
  children,
}: {
  user: User;
  signOut: () => void;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): Ctx {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
