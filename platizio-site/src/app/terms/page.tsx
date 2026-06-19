import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
          <article className="space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl font-display font-bold tracking-tight text-brand-deep sm:text-4xl">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: 19 June 2026
              </p>
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                These Terms of Service are a draft provided for transparency and
                are pending review by qualified legal counsel before launch. They
                may be updated to reflect final legal and regulatory requirements.
              </p>
            </header>

            <p className="text-sm leading-relaxed text-muted-foreground">
              These Terms of Service (the &ldquo;Terms&rdquo;) govern your use of
              the Platizio website and services. Please read them carefully before
              applying.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                1. Acceptance of these Terms
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                By accessing our website, submitting an application, or otherwise
                using our services, you agree to be bound by these Terms and by our{" "}
                <a
                  href="/privacy"
                  className="font-medium text-brand hover:text-brand-deep"
                >
                  Privacy Policy
                </a>
                . If you do not agree, please do not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                2. Description of service
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Platizio provides facilitation services only. We help you obtain a
                Net Worth Certificate through affiliated Chartered Accountants and
                assist you in preparing and submitting a SEBI Accredited Investor
                application to NDML (NSDL Database Management Ltd). Platizio is{" "}
                <span className="font-medium text-foreground">not</span> SEBI, NDML,
                or any government or regulatory authority, and is not affiliated
                with, endorsed by, or acting on behalf of any of them. We do not
                grant accreditation and cannot guarantee that your application will
                be approved; the decision rests solely with the relevant
                accreditation agency under the applicable regulatory framework.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                3. Your responsibilities
              </h2>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  You must provide accurate, current, and complete information in
                  your application.
                </li>
                <li>
                  You must ensure that all documents you upload are genuine,
                  unaltered, and belong to you (or to the co-applicant on whose
                  behalf you are authorised to act).
                </li>
                <li>
                  You are responsible for keeping your account and submission
                  details confidential.
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Providing false, misleading, or fraudulent information or documents
                may result in rejection of your application and may have legal
                consequences for you.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                4. Fees
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our fees for each service are displayed during the application
                process. The fees shown are inclusive as described, and Goods and
                Services Tax (GST) applies as required by law. Fees relate to our
                facilitation and certification services and are separate from any
                charges levied by the accreditation agency. Unless stated
                otherwise, fees are non-refundable once processing of your
                application has begun.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                5. No investment advice
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Platizio does not provide investment, financial, legal, or tax
                advice. Nothing on our website or in our communications constitutes
                a recommendation to make any investment or a guarantee of any
                outcome. You should seek independent professional advice before
                making any financial decision.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                6. Limitation of liability
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To the maximum extent permitted by law, Platizio shall not be
                liable for any indirect, incidental, special, or consequential
                damages, or for any loss arising from the rejection of an
                application, delays by third parties (including Chartered
                Accountants or the accreditation agency), or your reliance on the
                service. Our total liability for any claim relating to the service
                shall not exceed the fees you paid to us for the relevant
                application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                7. Governing law &amp; jurisdiction
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                These Terms are governed by the laws of India. Any dispute arising
                out of or in connection with these Terms or our services shall be
                subject to the exclusive jurisdiction of the courts of Delhi,
                India.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                8. Changes to these Terms
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We may update these Terms from time to time. When we do, we will
                revise the &ldquo;Last updated&rdquo; date above. Your continued use
                of our services after any change constitutes your acceptance of the
                updated Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-semibold text-brand-deep">
                9. Contact
              </h2>
              {/* TODO(launch): real support contact email */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                For any questions about these Terms, contact us at{" "}
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
