import { brand, extras, services } from "@/content/contentBible";
import { Container } from "@/components/ui";

/**
 * Site footer (static, server-rendered — no client JS).
 * Columns: Company, Services, Contact (Email + Social). Bottom bar:
 * Copyright + Tagline. Service names are verbatim; navigation labels are
 * chrome. Social URLs come from the owner-approved `extras`.
 */

const COMPANY_LINKS = [
  { label: "Why Zipsar Exists", href: "#why" },
  { label: "Our Process", href: "#build" },
  { label: "Services", href: "#services" },
  { label: "R&D Lab", href: "#future" },
  { label: "Start Your Journey", href: "#finale" },
];

const SOCIAL_ICONS: Record<string, string> = {
  LinkedIn:
    "M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM0 8h5v16H0V8Zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.46 4.73-2.46C22.1 7.74 24 10.1 24 14.6V24h-5v-8.3c0-1.98-.04-4.53-2.76-4.53-2.76 0-3.18 2.16-3.18 4.39V24h-5V8Z",
  "X (Twitter)":
    "M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.5h7.59l5.24 6.93L18.9 1.5Zm-1.29 18.8h2.04L6.48 3.6H4.3l13.31 16.7Z",
  GitHub:
    "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z",
};

function SocialIcon({ label }: { label: string }) {
  const path = SOCIAL_ICONS[label];
  if (!path) return null;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d={path} />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-abyss border-line relative z-(--z-narrative) border-t">
      <Container size="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Company */}
          <div>
            <p className="text-display text-aurora font-semibold">{brand.name}</p>
            <p className="text-muted mt-3 max-w-xs text-sm">{brand.tagline}</p>
            <p className="text-faint mt-6 text-xs">{brand.theme}</p>
          </div>

          {/* Company navigation */}
          <nav aria-label="Company">
            <p className="overline-label text-faint mb-5">Company</p>
            <ul role="list" className="flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-foreground text-sm transition-colors duration-(--duration-beat)"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <p className="overline-label text-faint mb-5">Services</p>
            <ul role="list" className="flex flex-col gap-3">
              {services.items.map((service) => (
                <li key={service.name}>
                  <a
                    href="#services"
                    className="text-muted hover:text-foreground text-sm transition-colors duration-(--duration-beat)"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="overline-label text-faint mb-5">Contact</p>
            <a
              href={`mailto:${extras.contact.email}`}
              className="text-foreground hover:text-neon-blue-soft text-sm transition-colors duration-(--duration-beat)"
            >
              {extras.contact.email}
            </a>

            <ul role="list" className="mt-6 flex gap-3">
              {extras.social.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="glass-subtle border-line text-muted hover:text-neon-blue-soft hover:border-line-bright grid size-11 place-items-center rounded-full border transition-colors duration-(--duration-beat)"
                  >
                    <SocialIcon label={social.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-14" />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-faint text-xs">{extras.copyright}</p>
          <p className="overline-label text-neon-blue-soft">{brand.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
