import type { ReactNode } from "react";

export function Privacy() {
  return (
    <div className="container-page py-14">
      <div className="glass mx-auto max-w-3xl rounded-card p-6 sm:p-10">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-300">Legal</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: September 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-haze">
          <Section title="1. Overview">
            This policy describes, in general terms, how MOONpaper handles information when you use the
            site. This is placeholder copy for a demo project and should be reviewed and replaced with a
            policy suited to your actual data practices before commercial use.
          </Section>

          <Section title="2. Information we collect">
            Browsing the public wallpaper archive does not require an account. The admin dashboard requires
            sign in through Supabase Auth, which stores an email address and authentication credentials. We
            do not collect payment information, as MOONpaper does not process payments.
          </Section>

          <Section title="3. Cookies and local storage">
            The site may use local or session storage in your browser to remember interface state, such as
            whether the launch animation has already been shown. This information stays on your device and
            is not transmitted to a server.
          </Section>

          <Section title="4. Third party services">
            Wallpaper hosting and the admin database are powered by Supabase. Placeholder preview images in
            demo mode are served from a third party image placeholder service. Review the privacy practices
            of any connected service before deploying this project publicly.
          </Section>

          <Section title="5. Data retention">
            Wallpaper and collection data is retained until removed by an administrator through the admin
            dashboard. Admin account data is retained according to your Supabase project configuration.
          </Section>

          <Section title="6. Your choices">
            You can browse and download wallpapers without providing any personal information. If you have
            an admin account, you can request account changes or removal through the site operator.
          </Section>

          <Section title="7. Changes to this policy">
            This policy may be updated from time to time to reflect changes in how the site operates.
          </Section>

          <Section title="8. Contact">
            Questions about this policy can be directed to the site operator through the contact details
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
