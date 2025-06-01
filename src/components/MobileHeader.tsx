
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Phone, Users, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    }
  };

  // Navigation items for unauthenticated users
  const unauthenticatedNavItems = [
    { href: "/", label: "Home", icon: Phone },
    { href: "/signin", label: "Sign In", icon: User },
    { href: "/signup", label: "Sign Up", icon: Users },
  ];

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { href: "/", label: "Home", icon: Phone },
    { href: "/dashboard", label: "Dashboard", icon: User },
  ];

  const navItems = user ? authenticatedNavItems : unauthenticatedNavItems;
  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#00122D] via-[#00122D] to-[#00122D] backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="https://rpkttbmlvjshkbjrmnvo.supabase.co/storage/v1/object/public/mizaniclinic//Mizani%20(1).png" alt="Mizani Clinic Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-200" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">MIZANI CLINIC</h1>
              <p className="text-xs text-blue-200 -mt-1">Referral System</p>
            </div>
          </Link>
          <div className="text-white">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#00122D] via-[#00122D] to-[#00122D] backdrop-blur-md border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img src="https://rpkttbmlvjshkbjrmnvo.supabase.co/storage/v1/object/public/mizaniclinic//Mizani%20(1).png" alt="Mizani Clinic Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-200" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">MIZANI CLINIC</h1>
            <p className="text-xs text-blue-200 -mt-1">Referral System</p>
          </div>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-gradient-to-b from-[#00122D] to-[#00122D] border-white/10">
            <SheetHeader className="text-center border-b border-white/10 pb-4 mb-6">
              <img src="https://rpkttbmlvjshkbjrmnvo.supabase.co/storage/v1/object/public/mizaniclinic//Mizani%20(1).png" alt="Mizani Clinic Logo" className="w-16 h-16 object-contain mx-auto mb-3" />
              <SheetTitle className="text-2xl font-bold text-white">MIZANI CLINIC</SheetTitle>
              <p className="text-blue-200">Referral & Booking System</p>
            </SheetHeader>
            
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-tanzania-green to-green-400 text-white shadow-lg"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-blue-100 hover:bg-white/10 hover:text-white w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              )}
            </nav>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-blue-200 text-sm text-center">
                {user ? `Welcome back!` : "Refer friends and earn Tshs. 88,000/- per referral!"}
              </p>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-tanzania-green text-white shadow-md"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-blue-100 hover:bg-white/10 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-gray-200">
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
};

export default MobileHeader;
