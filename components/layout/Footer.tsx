import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer
      id="contacto"
      className="text-center py-10 px-8 border-t border-white/[0.08] text-muted text-xs tracking-wide font-sans"
    >
      <p>
        <strong className="text-gold">{siteConfig.fullName}</strong>
        {" · "}
        {siteConfig.location}
      </p>
      <p className="mt-1">{siteConfig.tagline}</p>
    </footer>
  );
}
