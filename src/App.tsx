
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import React from "react";
import { SidebarWrapper } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes with Sidebar */}
            <Route path="/" element={
              <SidebarWrapper>
                <Index />
              </SidebarWrapper>
            } />
            <Route path="/inventory" element={
              <SidebarWrapper>
                <Inventory />
              </SidebarWrapper>
            } />
            <Route path="/customers" element={
              <SidebarWrapper>
                <Customers />
              </SidebarWrapper>
            } />
            <Route path="/analytics" element={
              <SidebarWrapper>
                <Analytics />
              </SidebarWrapper>
            } />
            <Route path="/finance" element={
              <SidebarWrapper>
                <Finance />
              </SidebarWrapper>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
