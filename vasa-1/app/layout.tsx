import "./globals.css";
import type { Metadata } from "next";
import GlobalLayout from "@/components/layout/GlobalLayout";
import SessionWrapper from "@/components/auth/SessionWrapper";

export const metadata: Metadata = {
  title: "VAsA – Virtual Assistant’s Assistant",
  description: "A digital command center for Virtual Assistants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionWrapper>
          <GlobalLayout>{children}</GlobalLayout>
        </SessionWrapper>
      </body>
    </html>
  );
}
