import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Wall Panels", href: "/products?category=wall-panels" },
    { name: "Lighting", href: "/products?category=lighting" },
    { name: "Mirrors", href: "/products?category=mirrors" },
    { name: "Decor", href: "/products?category=decor" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Sustainability", href: "/about#sustainability" },
    { name: "Careers", href: "/about#careers" },
  ],
  support: [
    { name: "Delivery", href: "/contact#shipping" },
    { name: "Returns", href: "/contact#returns" },
    { name: "FAQ", href: "/contact#faq" },
    { name: "Care Guide", href: "/contact#care" },
  ],
}

export function Footer() {
  return (
    <footer className="px-3 pb-3 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl rounded-[40px] bg-foreground px-6 py-16 text-card sm:px-10 lg:px-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-3xl font-semibold tracking-[0.2em] text-card">
              SLATURA WOOD
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-card/70">
              Premium wood slat panels and curated interior decor. We believe in quality craftsmanship, sustainable materials and timeless design that elevates every space.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-card/10 text-card transition-colors hover:bg-card hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-card/10 text-card transition-colors hover:bg-card hover:text-foreground"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-card/10 text-card transition-colors hover:bg-card hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-card">Shop</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/70 transition-colors hover:text-card"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-card">Company</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/70 transition-colors hover:text-card"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-card">Support</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/70 transition-colors hover:text-card"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex justify-center border-t border-card/15 pt-10 sm:justify-end">
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-card/70 hover:text-card">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-card/70 hover:text-card">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
