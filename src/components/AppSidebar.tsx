
import { 
  LayoutDashboard, 
  List, 
  Users, 
  BarChart, 
  PieChart,
  Menu
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
      icon: LayoutDashboard,
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
          <div className="font-bold text-lg">Diamond Manager</div>
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
          Diamond Inventory System v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
