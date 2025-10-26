"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Box,
  ArrowLeftRight,
  User,
  PackagePlus,
  PackageMinus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Inventaris",
      logo: Box,
      plan: "RS",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      items: undefined, // Explicitly set items to undefined
    },
    {
      title: "Data Barang",
      url: "/admin/databarang",
      icon: Box,
      items: undefined, // Explicitly set items to undefined
    },
    {
      title: "Kelola Bahan",
      url: "#",
      icon: ArrowLeftRight,
      items: [
        {
          title: "Barang Masuk",
          url: "/admin/barangmasuk",
          icon: PackagePlus,
        },
        {
          title: "Barang Keluar",
          url: "/admin/barangkeluar",
          icon: PackageMinus,
        },
      ],
    },
    {
      title: "Profil",
      url: "/admin/profil",
      icon: User,
      items: undefined, // Explicitly set items to undefined
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
