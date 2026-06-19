import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <article className="space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl font-display font-bold tracking-tight text-brand-deep sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: 19 June 2026
              </p>
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                This Privacy Policy is a draft provided for transparency and is
                pending review by qualified legal counsel before launch. It may
                be updated to reflect final legal and regulatory requirements.
              </p>
            </header>

            <p className="text-sm leading-relaxed text-muted-foreground">
              This policy explains how Platizio collects, uses, shares, and
              protects your personal data when you use our website and apply to
              obtain a Net Worth Certificate and SEBI Accredited Investor status.
              It is written to align with India&apos;s Digital Personal Data
              Protection Act, 2023 (the &ldquo;DPDP Act&rdquo;).
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                1. Who we are
              </h2>
              {/* TODO(launch): registered company name & address */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                Platizio (operated by [LEGAL ENTITY NAME], [REGISTERED ADDRESS])
                provides facilitation services that help Indian investors obtain
                a Net Worth Certificate through affiliated Chartered Accountants
                and submit a SEBI Accredited Investor application to NDML (NSDL
                Database Management Ltd). For the purposes of the DPDP Act, we act
                as the Data Fiduciary that determines the purpose and means of
                processing your personal data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                2. What we collect
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To process your application we collect the following categories of
                personal data:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Identity details</span>{" "}
                  &mdash; your full name, PAN, and Aadhaar (only if you choose to
                  provide it).
                </li>
                <li>
                  <span className="font-medium text-foreground">Contact details</span>{" "}
                  &mdash; email address and phone number.
                </li>
                <li>
                  <span className="font-medium text-foreground">Address</span>{" "}
                  &mdash; your residential or correspondence address.
                </li>
                <li>
                  <span className="font-medium text-foreground">Spouse / co-applicant details</span>{" "}
                  &mdash; where a joint or family application requires them.
                </li>
                <li>
                  <span className="font-medium text-foreground">Financial documents</span>{" "}
                  &mdash; uploaded documents such as Income Tax Returns (ITR), bank
                  statements, and any existing net worth certificate, used to
                  establish eligibility.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                3. Why we collect it
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We collect and use your personal data solely to process your Net
                Worth Certificate and Accreditation application &mdash; namely to
                verify your eligibility, prepare your certificate through our
                affiliated Chartered Accountants, and submit your accreditation
                application to NDML. We do not use your data for any purpose beyond
                this without obtaining your separate consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                4. Legal basis &amp; consent
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We process your personal data on the basis of the consent you
                provide when you accept the Terms via the checkbox in the
                application form. Your consent is specific to the purposes
                described above. You may withdraw your consent at any time by
                contacting us using the details below; withdrawing consent may
                mean we can no longer process or complete your application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                5. Who we share it with
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We share your personal data only with parties that are necessary
                to process your application:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Affiliated Chartered Accountants who prepare and issue your Net
                  Worth Certificate.
                </li>
                <li>
                  The accreditation agency, NDML (NSDL Database Management Ltd), to
                  whom your accreditation application is submitted.
                </li>
                <li>
                  Service providers (for example, secure cloud hosting) that help
                  us operate our service, strictly for the purpose of processing
                  your application and under appropriate confidentiality
                  obligations.
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We never sell your personal data, and we do not share it for
                advertising or marketing by third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                6. Where it is stored &amp; security
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your personal data is stored on access-controlled cloud services.
                We apply reasonable technical and organisational safeguards to
                protect it against unauthorised access, disclosure, alteration, or
                loss. No method of transmission or storage is completely secure,
                so while we strive to protect your data we cannot guarantee
                absolute security.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                7. Retention &amp; deletion
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We retain your personal data only for as long as needed to process
                your application, or for as long as required to comply with legal
                or regulatory obligations. Where an application is abandoned,
                rejected, or left incomplete, the data and documents you uploaded
                may be deleted after 30 days, consistent with our Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                8. Your rights under the DPDP Act, 2023
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Subject to the DPDP Act, you have the right to:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>access a summary of the personal data we hold about you;</li>
                <li>request correction of inaccurate or incomplete data;</li>
                <li>request erasure of your personal data;</li>
                <li>withdraw your consent at any time;</li>
                <li>
                  raise a grievance and have it addressed through our grievance
                  redressal process.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                9. Grievance Officer
              </h2>
              {/* TODO(launch): real grievance officer name & contact */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                If you have any concerns about how your personal data is handled,
                you may contact our Grievance Officer: [NAME],{" "}
                <a
                  href="mailto:grievance@platizio.com"
                  className="font-medium text-brand hover:text-brand-deep"
                >
                  grievance@platizio.com
                </a>
                . We will acknowledge and address grievances within the timelines
                required under applicable law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                10. A note on Aadhaar
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Providing your Aadhaar is optional. You may complete your
                application without it. Where you do choose to provide it, we use
                it only as a supporting identity document for your application and
                do not use it for any form of authentication.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                11. Contact
              </h2>
              {/* TODO(launch): real support contact email */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                For any questions about this policy or your personal data, contact
                us at{" "}
                <a
                  href="mailto:support@platizio.com"
                  className="font-medium text-brand hover:text-brand-deep"
                >
                  support@platizio.com
                </a>
                .
              </p>
            </section>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
