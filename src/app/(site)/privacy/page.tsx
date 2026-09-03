import type { Metadata } from "next";

import { SITE } from "@/lib/content";
import { PageHero } from "@/components/ui";
import { LegalBody, LegalIntro } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Altveen Technologies Pvt Ltd collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use, and protect your data."
      />

      <LegalBody>
        <LegalIntro>
          {SITE.legalName} (“Altveen,” “we,” “us”) provides software development
          and digital marketing services. This policy describes how we handle
          information when you use our website, request a consultation, or
          engage our services.
        </LegalIntro>

        <h2>Information We Collect</h2>
        <p>
          <strong>Information you provide:</strong> When you fill out a contact
          form, consultation form, or newsletter signup, we collect the details
          you give us, such as name, email address, phone number, company name,
          and (for consultations) the services you are interested in. If you
          engage us for a project, we may also collect business requirements,
          brand assets, and access to systems (e.g. analytics, ad accounts) as
          needed to deliver the work.
        </p>
        <p>
          <strong>Automatically collected data:</strong> Our website may collect
          technical data such as IP address, browser type, device type, and
          pages visited. We use this to improve the site, analyse trends, and
          ensure security. We may use cookies or similar technologies in line
          with your preferences.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to: respond to your enquiries and
          consultation requests; deliver and manage software development,
          design, and digital marketing services; send service-related and
          marketing communications (including our newsletter) where you have
          agreed; improve our website and services; and comply with applicable
          law.
        </p>

        <h2>Sharing and Disclosure</h2>
        <p>
          We do not sell your personal data. We may share information with
          trusted service providers (e.g. hosting, email, analytics) who assist
          us in operating our business, under strict confidentiality. We may
          disclose information if required by law or to protect our rights,
          safety, or property.
        </p>

        <h2>Data Retention and Security</h2>
        <p>
          We retain your data only as long as needed for the purposes above or
          as required by law. We implement appropriate technical and
          organisational measures to protect your data against unauthorised
          access, loss, or misuse.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, or
          delete your personal data, or to object to or restrict certain
          processing. To exercise these rights or ask questions about this
          policy, contact us at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. The updated
          version will be posted on this page with a revised date. Continued use
          of our website or services after changes constitutes acceptance of the
          updated policy.
        </p>

        <p>
          <strong>Contact:</strong> {SITE.legalName}. Email:{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Last updated:
          February 2025.
        </p>
      </LegalBody>
    </>
  );
}
