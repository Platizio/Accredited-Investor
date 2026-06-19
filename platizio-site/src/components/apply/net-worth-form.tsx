"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Zap } from "lucide-react";
import { DOC_SECTIONS, Validity } from "./form-data";
import { MAX_FILE_BYTES, makeUploaders, newId, submitNetWorth } from "@/lib/submissions";
import {
  ApplicantStep,
  Button,
  CardError,
  FileField,
  SectionHeader,
  StepIndicator,
  SuccessScreen,
  TermsBlock,
  buildApplicantPayload,
  scrollToFirstError,
  useApplicant,
  validateApplicant,
} from "./form-core";

export function NetWorthForm() {
  const [resetKey, setResetKey] = useState(0);
  return <NetWorthInner key={resetKey} onRestart={() => setResetKey((k) => k + 1)} />;
}

function NetWorthInner({ onRestart }: { onRestart: () => void }) {
  const ctrl = useApplicant();
  const [page, setPage] = useState<1 | 2>(1);
  const [validity, setValidity] = useState<Validity>("");
  const [tnc, setTnc] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [done, setDone] = useState(false);

  const filesRef = useRef<Record<string, File[]>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const isThreeYear = validity === "threeyear";
  const { isJoint } = ctrl;

  const clearError = (key: string) =>
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });

  const onFiles = (id: string, files: File[]) => {
    filesRef.current[id] = files;
    if (files.some((f) => f.size > MAX_FILE_BYTES)) {
      setErrors((e) => ({ ...e, [id]: "Each file must be 5 MB or smaller." }));
    } else {
      clearError(id);
    }
  };

  const selectValidity = (v: Exclude<Validity, "">) => {
    setValidity(v);
    clearError("validity");
  };

  const fillSample = () => {
    ctrl.fillApplicantSample();
    setValidity("twoyear");
    setErrors({});
  };

  // ── Validation ──
  const validatePage1 = () => {
    const errs = validateApplicant(ctrl);
    if (!tnc) errs.tnc = "You must agree to the Terms & Conditions to proceed.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      scrollToFirstError();
      return false;
    }
    return true;
  };

  const validatePage2 = () => {
    const errs: Record<string, string> = {};
    if (!validity) errs.validity = "Please select a certificate validity period.";
    if (!filesRef.current.nw_itr?.[0]) errs.nw_itr = "Latest year ITR is required.";
    if (isThreeYear && !filesRef.current.nw_itr_prev?.[0])
      errs.nw_itr_prev = "Previous year ITR is required for a 3-year certificate.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      scrollToFirstError();
      setStatusMsg("Please fix the errors above before submitting.");
      return false;
    }
    setStatusMsg("");
    return true;
  };

  const goToPage2 = () => {
    if (!validatePage1()) return;
    setPage(2);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const goToPage1 = () => {
    setPage(1);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePage2()) return;
    setSubmitting(true);
    setStatusMsg("");
    try {
      const submissionId = newId();
      const { uploadFile, uploadMultiFile } = makeUploaders(filesRef, `net-worth/${submissionId}`);

      const documents = {
        itr: await uploadFile("nw_itr"),
        itrPrev: isThreeYear ? await uploadFile("nw_itr_prev") : null,
        cas: await uploadFile("nw_cas"),
        pms: await uploadMultiFile("nw_pms"),
        bank: await uploadMultiFile("nw_bank"),
        pf: await uploadMultiFile("nw_pf"),
        intl: await uploadMultiFile("nw_intl"),
        realEstateProof: await uploadMultiFile("nw_realestate_proof"),
        realEstateValue: await uploadMultiFile("nw_realestate_value"),
        gold: await uploadFile("nw_gold"),
        jewellery: await uploadFile("nw_jewellery"),
        loans: await uploadMultiFile("nw_loans"),
      };

      await submitNetWorth({
        id: submissionId,
        applicant: buildApplicantPayload(ctrl),
        certValidity: isThreeYear ? "3-Year" : "2-Year",
        tncAccepted: tnc,
        documents,
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setStatusMsg("✗ Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const itrDesc = isThreeYear
    ? "Upload the latest and previous year ITR or acknowledgements (both required for a 3-year certificate). PDF format only."
    : "Upload the latest year ITR or ITR acknowledgement. PDF format only.";

  if (done) {
    return (
      <SuccessScreen
        title="Net Worth Certificate request submitted!"
        message="Thank you — our affiliated CA team will review your documents, prepare your Net Worth Certificate, and reach out to you shortly."
        onRestart={onRestart}
      />
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <StepIndicator page={page} labels={["Applicant Details", "Validity & Documents"]} />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-brand-deep/5">
        <div className="h-1.5 bg-gradient-to-r from-brand-deep via-brand to-brand-light" />
        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10">
          <div className="mb-4 text-right">
            <button
              type="button"
              onClick={fillSample}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand px-3.5 py-2 text-xs font-semibold text-brand transition-colors hover:bg-accent"
            >
              <Zap className="size-3.5" /> Fill Sample Data
            </button>
          </div>

          <AnimatePresence mode="wait">
            {page === 1 ? (
              <motion.div key="p1" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <ApplicantStep
                  ctrl={ctrl}
                  errors={errors}
                  clearError={clearError}
                  jointTitle="Joint – Spouse"
                  jointDesc="Joint Net Worth Certificate with your spouse as co-applicant"
                />
                <TermsBlock checked={tnc} onChange={(v) => { setTnc(v); if (v) clearError("tnc"); }} error={errors.tnc} />
                <Button type="button" onClick={goToPage2} size="lg" className="mt-7 h-12 w-full bg-brand text-base hover:bg-brand-deep">
                  Next → Validity &amp; Documents
                </Button>
              </motion.div>
            ) : (
              <motion.div key="p2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }}>
                <button type="button" onClick={goToPage1} className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-deep">
                  <ArrowLeft className="size-4" /> Back to Applicant Details
                </button>

                {/* 3 · Certificate Validity */}
                <SectionHeader>3 · Certificate Validity</SectionHeader>
                <p className="mb-4 text-xs text-muted-foreground">
                  Select the validity period for your Net Worth Certificate. This determines how many years of ITR are required.
                </p>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                  {(
                    [
                      { v: "twoyear", name: "2-Year Certificate", processing: "₹7,000+GST", ndml: "₹10,000+GST", total: "₹17,000+GST", itr: "Latest year ITR required" },
                      { v: "threeyear", name: "3-Year Certificate", processing: "₹9,000+GST", ndml: "₹14,500+GST", total: "₹23,500+GST", itr: "Latest + previous year ITR required" },
                    ] as const
                  ).map((plan) => (
                    <button
                      key={plan.v}
                      type="button"
                      role="radio"
                      aria-checked={validity === plan.v}
                      onClick={() => selectValidity(plan.v)}
                      className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        validity === plan.v ? "border-brand bg-accent/50 shadow-md shadow-brand/10" : "border-border bg-card hover:border-brand/40 hover:shadow-sm"
                      }`}
                    >
                      <div className="text-[15px] font-bold">{plan.name}</div>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between"><span className="font-semibold text-foreground/70">Processing Fees</span><span>{plan.processing}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-foreground/70">NDML Fees</span><span>{plan.ndml}</span></div>
                        <div className="mt-1 flex justify-between border-t border-dashed border-border pt-1"><span className="font-semibold text-foreground/70">Total</span><span className="font-bold text-brand-deep">{plan.total}</span></div>
                        <div className="pt-1 italic">{plan.itr}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <CardError show={!!errors.validity}>{errors.validity}</CardError>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  All-inclusive — Platizio arranges your Net Worth Certificate through our affiliated CA and handles your NDML accreditation. GST applies to all fees.
                </p>

                {/* 4 · Documents Upload */}
                <SectionHeader>4 · Documents Upload</SectionHeader>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG · Max 5 MB per file · Please self-attest physical documents before uploading.
                </p>
                {!validity && (
                  <p className="mb-4 text-xs font-semibold text-brand">← Select a certificate validity above to confirm the required ITR documents.</p>
                )}
                <div className="mb-5 rounded-lg border border-brand/25 bg-accent/60 px-4 py-3 text-[13px] leading-relaxed text-brand-deep">
                  Documents to prepare your <strong>Net Worth Certificate</strong>
                  {validity ? <> · <strong>{isThreeYear ? "3-Year" : "2-Year"} Certificate</strong></> : ""} — prove
                  net worth ≥ ₹7.5 Crore (financial assets ≥ ₹3.75 Crore). Upload at least one financial asset statement.
                  {isJoint ? " Combined figures for both spouses." : ""}
                </div>

                {DOC_SECTIONS.nw.map((cat) => (
                  <div key={cat.title} className="mb-6">
                    <div className="text-sm font-bold">
                      {cat.title} {cat.required && <span className="text-red-600">*</span>}
                    </div>
                    <p className="mt-0.5 mb-3 text-xs text-muted-foreground">{cat.isItr ? itrDesc : cat.desc}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {cat.fields
                        .filter((f) => !f.prevYear || isThreeYear)
                        .map((f) => (
                          <FileField key={f.id} field={f} combine={isJoint} error={errors[f.id]} onFiles={onFiles} />
                        ))}
                    </div>
                  </div>
                ))}

                <Button type="submit" size="lg" disabled={submitting} className="mt-7 h-12 w-full bg-brand text-base hover:bg-brand-deep">
                  {submitting ? (
                    <><Loader2 className="animate-spin" data-icon="inline-start" /> Uploading &amp; Submitting…</>
                  ) : (
                    <>Submit Net Worth Request <ArrowRight data-icon="inline-end" /></>
                  )}
                </Button>
                {statusMsg && <p className="mt-4 text-center text-sm font-semibold text-red-600">{statusMsg}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your documents are used solely to prepare your Net Worth Certificate.
      </p>
    </div>
  );
}
