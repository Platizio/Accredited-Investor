import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { FileSpreadsheet, FolderCheck } from "lucide-react";

const GROUPS = [
  {
    icon: FileSpreadsheet,
    step: "For the Net Worth Certificate",
    items: [
      "Income Tax Returns (latest year; two years for a 3-year certificate)",
      "CAS statement — NSDL / CDSL demat, mutual funds & NPS holdings",
      "Bank, PMS / AIF and provident fund statements",
      "Real estate ownership proof with latest ready-reckoner value",
      "Loan statements or balance sheet for liabilities, if any",
    ],
  },
  {
    icon: FolderCheck,
    step: "For the Accreditation Agency",
    items: [
      "Net Worth Certificate issued by a Chartered Accountant",
      "Copy of PAN (and Aadhaar, if provided)",
      "Marriage Certificate for Joint – Spouse applications",
      "Signed undertakings as per SEBI-approved templates",
    ],
  },
];

export function Documents() {
  return (
    <section id="documents" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            Process &amp; documentation
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Keep these documents{" "}
            <span className="font-display italic text-brand">ready</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Exactly what you&apos;ll need depends on your eligibility path —
            the application walks you through it field by field.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <StaggerItem key={g.step} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand">
                    <g.icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-brand">
                      STAGE {gi + 1}
                    </div>
                    <h3 className="font-semibold">{g.step}</h3>
                  </div>
                </div>
                <ul className="mt-5 space-y-3">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-lg border border-dashed border-brand/30 bg-background px-4 py-3 text-sm leading-snug"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          Accepted formats: PDF, JPG, PNG · max 5 MB per file · please
          self-attest physical documents before uploading. For Joint – Spouse
          applications, upload combined documents for both applicants.
        </Reveal>
      </div>
    </section>
  );
}
