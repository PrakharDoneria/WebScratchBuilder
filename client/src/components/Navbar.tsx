import { Link, useLocation } from "wouter";
import { Code, Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-primary to-primary-foreground/70 bg-clip-text text-transparent">HTML Blocks</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${
              location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Projects
          </Link>
          <Link 
            href="/editor" 
            className={`text-sm font-medium transition-colors ${
              location.startsWith("/editor") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Editor
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="container py-4 flex flex-col space-y-3">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4 inline-block mr-2" />
              Projects
            </Link>
            <Link 
              href="/editor" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.startsWith("/editor") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Code className="h-4 w-4 inline-block mr-2" />
              Editor
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}