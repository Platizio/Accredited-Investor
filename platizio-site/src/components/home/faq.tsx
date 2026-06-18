import { Reveal } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Faq = {
  q: string;
  a: string;
  bullets?: string[];
};

const FAQS: Faq[] = [
  {
    q: "What is an Accredited Investor?",
    a: "An Accredited Investor is an individual or entity recognised under SEBI's framework as financially sophisticated — based on income, net worth, or both. Accreditation unlocks investment products such as AIFs, PMS, SIFs, Angel Funds and Co-Investment Vehicles with lower minimum ticket sizes and relaxed regulatory conditions.",
  },
  {
    q: "Who is eligible to apply?",
    a: "You can qualify through any one of three paths:",
    bullets: [
      "Net Worth — total net worth of ₹7.5 Crore or more, with at least ₹3.75 Crore in financial assets.",
      "Hybrid — annual income of ₹1 Crore or more, plus net worth of ₹5 Crore with at least ₹2.5 Crore in financial assets.",
      "Income — annual income of ₹2 Crore or more.",
    ],
  },
  {
    q: "Can I apply jointly with my spouse?",
    a: "Yes. Choose the Joint – Spouse account type in the application and provide your spouse's details alongside your own. Financial thresholds are then assessed on your combined documents — the form will ask for combined statements wherever applicable.",
  },
  {
    q: "Can NRIs apply?",
    a: "Yes. The application supports both Indian Residents and Non-Resident Indians. NRI applicants simply select their country of residence while filling in address details.",
  },
  {
    q: "What is the difference between the 2-year and 3-year certificates?",
    a: "The validity period and the documentation. A 2-year certificate needs your latest year's ITR, while a 3-year certificate needs ITRs for the latest two years. Fees also differ: a 2-year certificate totals ₹13,000–₹18,000 and a 3-year certificate totals ₹17,500–₹22,500, depending on whether Platizio arranges your Net Worth Certificate (Processing ₹3,000 without it or ₹8,000 with it, plus the NDML fee of ₹10,000 for 2-year or ₹14,500 for 3-year).",
  },
  {
    q: "Who issues the final certificate?",
    a: "The Accredited Investor Certificate is issued by NSDL Database Management Limited (NDML), the accreditation agency. Platizio prepares and submits your application — including the CA-issued Net Worth Certificate where required — and the agency grants the final approval.",
  },
  {
    q: "What happens to my data and documents?",
    a: "Your information is collected solely to process your accreditation application and is shared only with accreditation agencies, verification providers and other authorised parties involved in processing. If your application is abandoned, rejected or remains incomplete, your uploaded data may be securely deleted after 30 days, subject to legal retention requirements.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-display font-bold tracking-tight sm:text-4xl">
            Frequently asked{" "}
            <span className="font-display italic text-brand">questions</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-card px-6 shadow-sm"
          >
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-[15px] font-semibold hover:text-brand-deep">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.bullets ? (
                    <>
                      <p>{f.a}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {f.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    f.a
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
