import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/D3A231B5-F339-40D4-B759-2D21C8E8F27A_1762021495636.png";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
          <img src={logoImage} alt="TapTrust Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gold">TapTrust</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" data-testid="link-home-nav">
            <Button variant="ghost" className={location === "/" ? "text-gold" : "text-muted-foreground hover:text-foreground"}>
              Home
            </Button>
          </Link>
          <Link href="/login" data-testid="link-login">
            <Button variant="ghost">Accedi</Button>
          </Link>
          <Link href="/register" data-testid="link-register">
            <Button className="btn-gold">Attiva ora</Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            <Link href="/" data-testid="link-home-mobile">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${location === "/" ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Button>
            </Link>
            <Link href="/login" data-testid="link-login-mobile">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accedi
              </Button>
            </Link>
            <Link href="/register" data-testid="link-register-mobile">
              <Button 
                className="btn-gold w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Attiva ora
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
