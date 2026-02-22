"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLoginButton";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { user, isLoggedIn, loading, init, logout } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return <div className="h-9 w-32 animate-pulse rounded bg-muted" />;
  }

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{user.email}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          登出
        </Button>
      </div>
    );
  }

  return <GoogleLoginButton />;
}
