"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <Button
      variant="danger"
      fullWidth
      loading={loading}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
