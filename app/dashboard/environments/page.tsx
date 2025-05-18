"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DatabaseEnvironments } from "@/components/database-environments";

export default function EnvironmentsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col p-4 lg:p-6 gap-6">
            <h1 className="text-4xl font-bold">Database Environments</h1>
            <DatabaseEnvironments />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
