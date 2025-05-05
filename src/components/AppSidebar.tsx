
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ChartBar, 
  Wallet 
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  
  const navigationItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      tooltip: "Dashboard"
    },
    {
      title: "Inventory",
      path: "/inventory",
      icon: Package,
      tooltip: "Diamond Inventory"
    },
    {
      title: "Customers",
      path: "/customers",
      icon: Users,
      tooltip: "Customer Management"
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: ChartBar,
      tooltip: "Analytics & Reports"
    },
    {
      title: "Finance",
      path: "/finance",
      icon: Wallet,
      tooltip: "Financial Summary"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4 px-2">
        <h1 className="text-sidebar-foreground font-bold text-lg">Diamond Vault</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.tooltip}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-sidebar-foreground/70 text-xs py-2 px-4">
        © 2025 Diamond Vault
      </SidebarFooter>
    </Sidebar>
  );
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          <div className="flex-1 px-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
