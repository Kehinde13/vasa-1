"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/common/Button";

export default function LogoutButton() {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
      Logout
    </Button>
  );
}
