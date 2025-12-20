import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/D3A231B5-F339-40D4-B759-2D21C8E8F27A_1762021495636.png";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
          <img src={logoImage} alt="TapTrust Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gold">TapTrust</span>
        </Link>
        
        <nav className="flex items-center space-x-2 md:space-x-6">
          <Link href="/" className="hidden md:block" data-testid="link-home-nav">
            <Button variant="ghost" className={location === "/" ? "text-gold" : "text-muted-foreground hover:text-foreground"}>
              Home
            </Button>
          </Link>
          <Link href="/taptrust" className="hidden md:block" data-testid="link-taptrust-nav">
            <Button variant="ghost" className={location === "/taptrust" ? "text-gold" : "text-muted-foreground hover:text-foreground"}>
              Cos'è TapTrust
            </Button>
          </Link>
          <Link href="/login" data-testid="link-login">
            <Button className="btn-gold">Accedi</Button>
          </Link>
          <Link href="/register" className="hidden md:block" data-testid="link-register">
            <Button className="btn-gold">Attiva ora</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
