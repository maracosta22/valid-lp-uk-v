"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { StringLights } from "@/components/christmas/string-lights"

const navigation = [
  { name: "Shop", href: "/products" },
  { name: "Wall Panels", href: "/products?category=wall-panels" },
  { name: "Christmas", href: "/christmas", festive: true },
  { name: "Lighting", href: "/products?category=lighting" },
  { name: "Decor", href: "/products?category=decor" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-1 sm:px-6 lg:px-10 lg:py-2">
      <nav className="glass mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full pl-2 pr-2 shadow-[0_8px_30px_rgb(51_37_28/0.08)] sm:pl-3 lg:h-16 lg:pl-6">
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-full bg-card hover:bg-muted">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 rounded-r-[32px] bg-background">
            <div className="flex items-center justify-between pb-6">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-serif text-2xl tracking-widest text-foreground"
              >
                SLATURA WOOD
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full bg-card hover:bg-muted" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-lg transition-colors ${
                    "festive" in item ? "text-festive" : "text-foreground/80 hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center font-serif text-xl font-semibold tracking-[0.2em] text-foreground transition-opacity hover:opacity-80 sm:text-2xl lg:text-[26px]">
          SLATURA WOOD
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[13px] font-medium uppercase tracking-wider transition-colors duration-200 ${
                "festive" in item ? "text-festive hover:text-festive/80" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div aria-hidden="true" className="w-10" />
      </nav>
      <StringLights />
    </header>
  )
}
