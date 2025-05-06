
import { 
  Diamond, 
  List, 
  Users, 
  BarChart, 
  PieChart
} from "lucide-react";
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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  
  // Navigation items with icons and routes
  const navigationItems = [
    {
      title: "Dashboard",
      icon: Diamond,
      path: "/"
    },
    {
      title: "Inventory",
      icon: List,
      path: "/inventory"
    },
    {
      title: "Customers",
      icon: Users,
      path: "/customers"
    },
    {
      title: "Analytics",
      icon: BarChart,
      path: "/analytics"
    },
    {
      title: "Finance",
      icon: PieChart,
      path: "/finance"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 pt-4">
        <div className={`flex items-center gap-2 ${state === "collapsed" ? "sr-only" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-gem-gold"
          >
            <path d="M16 2s1.5 2 2 3.5c.34 1 1.74 1.5 3 1.5h1L17.5 15" />
            <path d="M8.53 2c-.77 2.2-1.64 3.2-3.53 4" />
            <path d="M4.95 6c-1.09 1.33-1.27 1.67-1.85 3C2.9 10 2.5 17 2.5 19c0 1 .33 1 1 1a6 6 0 0 0 3.5-1.5 3.6 3.6 0 0 1 5 0 6 6 0 0 0 3.5 1.5c.67 0 1 0 1-1 0-2-.4-9-1.6-10-.58-1.33-.76-1.67-1.85-3" />
            <path d="M7 15a3 3 0 1 0 3-3 3 3 0 0 0-3 3z" />
          </svg>
          <div className="font-bold text-lg">Gem Guardian</div>
        </div>
        <SidebarTrigger className={state === "collapsed" ? "ml-auto" : ""} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{state === "collapsed" ? "" : item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className={`text-xs text-muted-foreground ${state === "collapsed" ? "sr-only" : ""}`}>
          Gem Guardian v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
