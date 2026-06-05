import { Link } from "@tanstack/react-router";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Featured Players", to: "/featured-players" },
  { label: "Wellness Hub", to: "/wellness-hub" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "Stories", to: "/stories" },
  { label: "Clubs", to: "/clubs" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
          <Link to="/" className="font-display text-2xl flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-ember" />
            ninety<span className="text-pitch">minds</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-ember transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-ember transition-colors">Instagram</a>
            <a href="#" className="hover:text-ember transition-colors">X</a>
            <a href="#" className="hover:text-ember transition-colors">Press</a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 NinetyMinds. Made in Lagos, for the continent.
        </div>
      </div>
    </footer>
  );
}
