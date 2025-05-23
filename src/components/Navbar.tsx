
import { Bell, Search, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);

    if (authStatus) {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUserEmail(userData.email || "");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserEmail("");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-gem-blue">
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
          <Link to="/" className="hover:opacity-80">
            <span>Gem Guardian</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="w-64 bg-background pl-8 md:w-80"
              />
            </div>
          </form>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gem-gold" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {isAuthenticated ? (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userEmail.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="border-b pb-2">
                      <p className="text-sm font-medium">{userEmail}</p>
                    </div>
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleLogin}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Log in</span>
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
