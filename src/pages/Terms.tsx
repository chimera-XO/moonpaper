import type { ReactNode } from "react";

export function Terms() {
  return (
    <div className="container-page py-14">
      <div className="glass mx-auto max-w-3xl rounded-card p-6 sm:p-10">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-300">Legal</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Terms and conditions</h1>
        <p className="mt-3 text-sm text-muted">Last updated: September 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-haze">
          <Section title="1. Overview">
            These terms govern your use of MOONpaper, a platform for browsing and downloading wallpapers for
            desktop and mobile devices. By using this site, you agree to the terms below. This is placeholder
            legal copy for a demo project and should be replaced with terms reviewed by a legal professional
            before commercial use.
          </Section>

          <Section title="2. Use of wallpapers">
            Wallpapers made available through MOONpaper are intended for personal, non-commercial use as
            desktop or mobile backgrounds unless a specific license states otherwise. Redistribution, resale,
            or use of wallpapers as standalone commercial assets is not permitted without separate written
            permission.
          </Section>

          <Section title="3. Accounts and admin access">
            Access to the admin dashboard is restricted to authorized site operators. You are responsible for
            keeping any admin credentials secure and for all activity carried out under your account.
          </Section>

          <Section title="4. Availability">
            MOONpaper is provided on an as is basis. We do not guarantee uninterrupted availability of the
            site, the archive, or any individual wallpaper, and content may be added, changed, or removed at
            any time.
          </Section>

          <Section title="5. Limitation of liability">
            To the extent permitted by law, MOONpaper and its operators are not liable for indirect,
            incidental, or consequential damages arising from use of the site or downloaded content.
          </Section>

          <Section title="6. Changes to these terms">
            These terms may be updated from time to time. Continued use of the site after changes are posted
            constitutes acceptance of the revised terms.
          </Section>

          <Section title="7. Contact">
            Questions about these terms can be directed to the site operator through the contact details
            provided on the production deployment of this site.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-display text-lg font-semibold text-ink">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
