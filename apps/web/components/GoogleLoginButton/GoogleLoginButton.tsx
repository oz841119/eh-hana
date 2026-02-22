'use client';

import { Button } from "@/components/ui/button";
import { GoalIcon } from "lucide-react";

interface GoogleLoginButtonProps {
  /** 登入成功後要跳轉的前端路徑，預設為首頁 "/" */
  redirectTo?: string;
}

export const GoogleLoginButton = ({ redirectTo = '/' }: GoogleLoginButtonProps) => {
  const handleLogin = () => {
    const params = new URLSearchParams({ redirectTo });
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/auth/google?${params}`;
  };

  return (
    <Button onClick={handleLogin}>
      <GoalIcon />
      Google
    </Button>
  );
};
