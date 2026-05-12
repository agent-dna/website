import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Resources", href: "#resources" },
  { label: "Company", href: "#company" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-4 top-5 z-50 rounded-2xl transition-all ${
        scrolled
          ? "border-b border-soft-200 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-white/0"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <Logo variant="blue" height={28} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-2 text-[13.5px] font-medium text-ink-subtle transition-colors hover:bg-soft-50 hover:text-navy-500"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {/* <a href="#contact" className="btn-secondary">
            Sign in
          </a> */}
          <a href="#demo" className="btn-primary">
            Book a Demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-full border border-soft-200 p-2 text-navy-500 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-soft-200 bg-white px-6 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-navy-500 hover:bg-soft-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <a href="#contact" className="btn-secondary flex-1">
              Sign in
            </a>
            <a href="#demo" className="btn-primary flex-1">
              Book a Demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
