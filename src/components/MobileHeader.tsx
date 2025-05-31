
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Users, Calendar, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileHeader = () => {
  const location = useLocation();
  
  const navItems = [
    { href: "/", label: "Home", icon: Phone },
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/register", label: "Register", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-tanzania-navy via-tanzania-navy to-blue-900 backdrop-blur-md border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-tanzania-green to-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">Mizani Clinic</h1>
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
          <SheetContent side="right" className="w-80 bg-gradient-to-b from-tanzania-navy to-blue-900 border-white/10">
            <SheetHeader className="text-center border-b border-white/10 pb-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-tanzania-green to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <SheetTitle className="text-2xl font-bold text-white">Mizani Clinic</SheetTitle>
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
            </nav>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-blue-200 text-sm text-center">
                Refer friends and earn TSH 500 per referral!
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
        </nav>
      </div>
    </header>
  );
};

export default MobileHeader;
