import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import { EcoViewLogo } from "@/components/brand/EcoViewLogo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Mapa" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

interface HeaderProps {
  overlay?: boolean;
}

export function Header({ overlay = false }: HeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header
      className={cn(
        "z-40 h-16 w-full border-b border-border/60 bg-card/95 backdrop-blur-md",
        overlay ? "absolute left-0 top-0" : "sticky top-0",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4 md:px-6">
        <Link to="/" className="shrink-0" aria-label="EcoView — página inicial">
          <EcoViewLogo />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.to)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {isActive(item.to) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2">
          <div className="relative hidden w-full max-w-md md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Buscar datasets, camadas, municípios…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Busca global"
            />
          </div>

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
            aria-label="Notificações"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          <button
            className="hidden h-10 items-center gap-2 rounded-lg border border-border bg-card px-2.5 pr-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted md:inline-flex"
            aria-label="Conta do usuário"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </span>
            <span className="hidden lg:inline">Visitante</span>
          </button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <div className="border-b border-border p-4">
                <EcoViewLogo />
              </div>
              <nav className="flex flex-col p-2" aria-label="Navegação móvel">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.to)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar…"
                    className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Busca"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
