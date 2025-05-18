"use client";

import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="flex h-14 items-center justify-end border-b px-4">
      <ModeToggle />
    </header>
  );
}
