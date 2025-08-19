"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Home, Notebook, PanelLeft } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="size-6 text-primary" />
            <span className="text-lg font-semibold font-headline">Devfolio Hub</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Profile"
              >
                <Link href="/">
                  <Home />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/calculator"}
                tooltip="Calculators"
              >
                <Link href="/calculator">
                  <Calculator />
                  <span>Calculators</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/notes"}
                tooltip="Notes"
              >
                <Link href="/notes">
                  <Notebook />
                  <span>Notes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
             <PanelLeft />
          </Button>
          <h1 className="flex-1 text-xl font-semibold font-headline">
            {getPageTitle(pathname)}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function getPageTitle(pathname: string) {
  switch (pathname) {
    case "/":
      return "Profile";
    case "/calculator":
      return "Financial Calculators";
    case "/notes":
      return "Personal Notes";
    default:
      return "Devfolio Hub";
  }
}
