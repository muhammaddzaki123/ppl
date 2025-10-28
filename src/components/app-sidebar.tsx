"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Box,
  ArrowLeftRight,
  User,
  PackagePlus,
  PackageMinus,
  Users,
  Settings,
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
import { Admin } from "@prisma/client";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Pick<Admin, "name" | "email"> | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const data = {
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
        items: undefined,
      },
      {
        title: "Data Barang",
        url: "/admin/databarang",
        icon: Box,
        items: undefined,
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
        title: "Users",
        url: "#",
        icon: Users,
        items: [
          {
            title: "All Users",
            url: "/admin/users",
          },
        ],
      },
      {
        title: "Profil",
        url: "/admin/profile",
        icon: User,
        items: undefined,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        items: [
          {
            title: "Set Satuan",
            url: "/admin/settings/satuan",
          },
          {
            title: "Klasifikasi",
            url: "/admin/settings/klasifikasi",
          },
        ],
      },
    ],
  };
  const userData = {
    name: user?.name ?? "Unknown",
    email: user?.email ?? "unknown@example.com",
    avatar: "/avatars/shadcn.jpg", // Placeholder avatar
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
