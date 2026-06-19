import { Reveal } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, type Faq } from "./faq-data";

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
