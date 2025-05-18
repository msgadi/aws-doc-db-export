"use client";

import { Database, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({
  variant,
}: {
  variant: "inset" | "sidebar" | "floating";
}) {
  const pathname = usePathname();

  return (
    <Sidebar variant={variant}>
      <div className="flex h-full flex-col gap-4">
        <div className="px-2 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            AWS DocumentDB Export
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                pathname === "/dashboard/collections" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link href="/dashboard/collections">
                <Database className="h-4 w-4" />
                Collections
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                pathname === "/dashboard/environments" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link href="/dashboard/environments">
                <Settings className="h-4 w-4" />
                Environments
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
