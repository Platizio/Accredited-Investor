import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-espresso text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-xl font-bold tracking-wide text-white">
              PLATIZIO
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Your gateway to SEBI Accredited Investor status — net worth
              certification, documentation, and NDML application support,
              end to end.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Explore
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/#why" className="hover:text-white">Why Accreditation</Link></li>
              <li><Link href="/#eligibility" className="hover:text-white">Eligibility</Link></li>
              <li><Link href="/#process" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/#fees" className="hover:text-white">Fees</Link></li>
              <li><Link href="/apply" className="hover:text-white">Apply Now</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Important
            </div>
            <p className="mt-4 text-xs leading-relaxed">
              Submission of an application does not guarantee grant of
              Accredited Investor status; final approval rests with the
              relevant accreditation agency under the applicable regulatory
              framework. Platizio does not provide investment advice.
            </p>
            <p className="mt-3 text-xs leading-relaxed">
              Disputes are subject to the exclusive jurisdiction of the courts
              of Delhi, India, under the governing law of India.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <span>© {new Date().getFullYear()} Platizio. All rights reserved.</span>
          <span>SEBI Accredited Investor framework · Certificates issued via NDML</span>
        </div>
      </div>
    </footer>
  );
}
