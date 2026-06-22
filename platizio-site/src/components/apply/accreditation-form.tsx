"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Zap } from "lucide-react";
import {
  ACC_IDENTITY_DOC,
  ACC_ITR_DOC,
  ACC_MARRIAGE_DOC,
  ACC_NW_CERT_DOC,
  ACC_UNDERTAKINGS_DOC,
  DocCategory,
  Eligibility,
  PROCESSING_FEE,
  Validity,
  formatRupees,
  payablePaise,
} from "./form-data";
import { MAX_FILE_BYTES, makeUploaders, newId, submitAccreditation } from "@/lib/submissions";
import { payWithRazorpay } from "@/lib/razorpay-client";
import {
  ApplicantStep,
  Button,
  CardError,
  FileField,
  OptionCard,
  SectionHeader,
  StepIndicator,
  SuccessScreen,
  TermsBlock,
  buildApplicantPayload,
  scrollToFirstError,
  useApplicant,
  validateApplicant,
} from "./form-core";

export function AccreditationForm() {
  const [resetKey, setResetKey] = useState(0);
  return <AccreditationInner key={resetKey} onRestart={() => setResetKey((k) => k + 1)} />;
}

function AccreditationInner({ onRestart }: { onRestart: () => void }) {
  const ctrl = useApplicant();
  const [page, setPage] = useState<1 | 2>(1);
  const [eligibility, setEligibility] = useState<Eligibility>("");
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

  // Path-specific proof: Net Worth → certificate, Income → ITR, Hybrid → both.
  const needsNwCert = eligibility === "networth" || eligibility === "hybrid";
  const needsItr = eligibility === "income" || eligibility === "hybrid";

  const pathLabelText =
    eligibility === "networth" ? "Net Worth"
    : eligibility === "hybrid" ? "Hybrid"
    : eligibility === "income" ? "Income" : "";

  const itrDesc = isThreeYear
    ? "Upload the latest and previous year ITR or acknowledgements (both required for a 3-year certificate). PDF format only."
    : "Upload the latest year ITR or ITR acknowledgement. PDF format only.";

  // Assemble the document list: path-specific proof first, then the common docs.
  // (Income → ITR, Net Worth → certificate, Hybrid → both.)
  const docCategories: DocCategory[] = [
    ...(needsItr ? [ACC_ITR_DOC] : []),
    ...(needsNwCert ? [ACC_NW_CERT_DOC] : []),
    ACC_IDENTITY_DOC,
    ...(isJoint ? [ACC_MARRIAGE_DOC] : []),
    ACC_UNDERTAKINGS_DOC,
  ];

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

  const selectEligibility = (p: Exclude<Eligibility, "">) => {
    setEligibility(p);
    clearError("eligibility");
  };
  const selectValidity = (v: Exclude<Validity, "">) => {
    setValidity(v);
    clearError("validity");
  };

  const fillSample = () => {
    ctrl.fillApplicantSample();
    setEligibility("networth");
    setValidity("twoyear");
    setErrors({});
  };

  // ── Validation ──
  const validatePage1 = () => {
    const errs = validateApplicant(ctrl, { requirePersonalDetails: true });
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
    if (!eligibility) errs.eligibility = "Please select an eligibility path.";
    if (!validity) errs.validity = "Please select a certificate validity period.";
    if (needsNwCert && !filesRef.current.acc_nw_cert?.[0]) errs.acc_nw_cert = "Net Worth Certificate is required.";
    if (needsItr && !filesRef.current.acc_itr?.[0]) errs.acc_itr = "Latest year ITR is required.";
    if (needsItr && isThreeYear && !filesRef.current.acc_itr_prev?.[0]) errs.acc_itr_prev = "Previous year ITR is required for a 3-year certificate.";
    if (!filesRef.current.acc_pan?.[0]) errs.acc_pan = "Copy of PAN is required.";
    if (isJoint && !filesRef.current.acc_marriage?.[0]) errs.acc_marriage = "Marriage Certificate is required for joint applications.";
    if (!filesRef.current.acc_undertakings?.length) errs.acc_undertakings = "Signed undertakings are required.";
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

  const amountPaise = payablePaise(PROCESSING_FEE.accreditation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePage2()) return;
    setSubmitting(true);
    setStatusMsg("");
    try {
      const submissionId = newId();

      // 1) Collect the processing fee FIRST — nothing is saved until a
      //    payment has been created AND its signature verified server-side.
      const payment = await payWithRazorpay({
        amount: amountPaise,
        name: "Platizio",
        description: "Accreditation — processing fee",
        receipt: `acc_${submissionId}`,
        prefill: {
          name: ctrl.fields.fullName,
          email: ctrl.fields.emailAddress,
          contact: ctrl.fields.phoneNumber,
        },
        onStatus: (s) =>
          setStatusMsg(s === "verifying" ? "Verifying payment…" : "Opening secure payment…"),
      });
      if (!payment) {
        setStatusMsg("Payment cancelled — your application was not submitted.");
        return;
      }

      // 2) Payment verified → upload documents and save the submission.
      setStatusMsg("Payment received — saving your application…");
      const { uploadFile, uploadMultiFile } = makeUploaders(filesRef, `accreditation/${submissionId}`);

      const documents = {
        nwCertificate: needsNwCert ? await uploadFile("acc_nw_cert") : null,
        itr: needsItr ? await uploadFile("acc_itr") : null,
        itrPrev: needsItr && isThreeYear ? await uploadFile("acc_itr_prev") : null,
        panCopy: await uploadFile("acc_pan"),
        aadhaarCopy: await uploadFile("acc_aadhaar"),
        marriageCertificate: isJoint ? await uploadFile("acc_marriage") : null,
        undertakings: await uploadMultiFile("acc_undertakings"),
      };

      const pathLabel =
        eligibility === "networth" ? "Net Worth" : eligibility === "hybrid" ? "Hybrid" : "Income";

      await submitAccreditation({
        id: submissionId,
        applicant: buildApplicantPayload(ctrl),
        gender: ctrl.fields.gender,
        occupation: ctrl.fields.occupation,
        eligibilityPath: pathLabel,
        certValidity: isThreeYear ? "3-Year" : "2-Year",
        tncAccepted: tnc,
        documents,
        payment: { paymentId: payment.paymentId, orderId: payment.orderId, amount: amountPaise },
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setStatusMsg(
        err instanceof Error
          ? err.message
          : "Payment or submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <SuccessScreen
        title="Accreditation application submitted!"
        message="Thank you — our team will verify your documents and submit your application to NDML. We'll reach out to you shortly."
        onRestart={onRestart}
      />
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <StepIndicator page={page} labels={["Applicant Details", "Eligibility & Documents"]} />

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
                  jointTitle="Joint Applicant"
                  jointDesc="Joint application with your spouse as co-applicant"
                  personalDetails
                />
                <TermsBlock checked={tnc} onChange={(v) => { setTnc(v); if (v) clearError("tnc"); }} error={errors.tnc} />
                <Button type="button" onClick={goToPage2} size="lg" className="mt-7 h-12 w-full bg-brand text-base hover:bg-brand-deep">
                  Next → Eligibility &amp; Documents
                </Button>
              </motion.div>
            ) : (
              <motion.div key="p2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }}>
                <button type="button" onClick={goToPage1} className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-deep">
                  <ArrowLeft className="size-4" /> Back to Applicant Details
                </button>

                {/* 3 · Eligibility Path */}
                <SectionHeader>3 · Eligibility Path</SectionHeader>
                <p className="mb-4 text-xs text-muted-foreground">Select how you meet SEBI&apos;s Accredited Investor criteria.</p>
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
                  <OptionCard selected={eligibility === "networth"} onSelect={() => selectEligibility("networth")} title="A. Net Worth">
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>· Net worth ≥ ₹7.5 Crore</li>
                      <li>· Financial assets ≥ ₹3.75 Crore</li>
                    </ul>
                  </OptionCard>
                  <OptionCard selected={eligibility === "hybrid"} onSelect={() => selectEligibility("hybrid")} title="B. Hybrid">
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>· Annual income ≥ ₹1 Crore</li>
                      <li>· Net worth ≥ ₹5 Crore</li>
                      <li>· Financial assets ≥ ₹2.5 Crore</li>
                    </ul>
                  </OptionCard>
                  <OptionCard selected={eligibility === "income"} onSelect={() => selectEligibility("income")} title="C. Income">
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>· Annual income ≥ ₹2 Crore</li>
                    </ul>
                  </OptionCard>
                </div>
                <CardError show={!!errors.eligibility}>{errors.eligibility}</CardError>

                {/* 4 · Certificate Validity */}
                <SectionHeader>4 · Certificate Validity</SectionHeader>
                <p className="mb-4 text-xs text-muted-foreground">Select the NDML Accredited Investor Certificate validity period.</p>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                  {(
                    [
                      { v: "twoyear", name: "2-Year Certificate", ndml: "₹10,000+GST", total: "₹12,000+GST" },
                      { v: "threeyear", name: "3-Year Certificate", ndml: "₹14,500+GST", total: "₹16,500+GST" },
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
                        <div className="flex justify-between"><span className="font-semibold text-foreground/70">Processing Fees</span><span>₹2,000+GST</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-foreground/70">NDML Fees</span><span>{plan.ndml}</span></div>
                        <div className="mt-1 flex justify-between border-t border-dashed border-border pt-1"><span className="font-semibold text-foreground/70">Total</span><span className="font-bold text-brand-deep">{plan.total}</span></div>
                      </div>
                    </button>
                  ))}
                </div>
                <CardError show={!!errors.validity}>{errors.validity}</CardError>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Processing fee is ₹2,000+GST because you provide your own documents. Don&apos;t have a Net Worth Certificate yet?{" "}
                  <a href="/apply/net-worth" className="font-semibold text-brand hover:underline">Apply for a Net Worth Certificate first.</a>
                </p>

                {/* 5 · Documents Upload */}
                <SectionHeader>5 · Documents Upload</SectionHeader>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG · Max 5 MB per file · Please self-attest physical documents before uploading.
                </p>
                <div className="mb-5 rounded-lg border border-brand/25 bg-accent/60 px-4 py-3 text-[13px] leading-relaxed text-brand-deep">
                  Documents required by the accreditation agency (<strong>NDML</strong>) to process your Accredited Investor application
                  {pathLabelText ? <> via the <strong>{pathLabelText}</strong> path</> : ""}.
                </div>

                {!eligibility && (
                  <p className="mb-5 text-xs font-semibold text-brand">
                    ← Select an eligibility path above to see the documents required for your path.
                  </p>
                )}

                {needsNwCert && (
                  <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-800">
                    ⚠ Your Net Worth Certificate must be dated within the last 6 months — certificates older than 6 months will not be accepted.
                  </div>
                )}

                {docCategories.map((cat) => (
                  <div key={cat.title} className="mb-6">
                    <div className="text-sm font-bold">
                      {cat.title} {cat.required && <span className="text-red-600">*</span>}
                    </div>
                    <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
                      {cat.isItr ? itrDesc : cat.desc}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {cat.fields
                        .filter((f) => !f.prevYear || isThreeYear)
                        .map((f) => (
                          <FileField key={f.id} field={f} error={errors[f.id]} onFiles={onFiles} />
                        ))}
                    </div>
                  </div>
                ))}

                <p className="mt-7 mb-3 text-center text-xs text-muted-foreground">
                  You&apos;ll pay the processing fee (₹2,000 + 18% GST) now via Razorpay to submit.
                  The NDML fee is payable later at registration.
                </p>
                <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full bg-brand text-base hover:bg-brand-deep">
                  {submitting ? (
                    <><Loader2 className="animate-spin" data-icon="inline-start" /> Processing…</>
                  ) : (
                    <>Pay {formatRupees(amountPaise)} &amp; Submit <ArrowRight data-icon="inline-end" /></>
                  )}
                </Button>
                {statusMsg && <p className="mt-4 text-center text-sm font-medium text-muted-foreground">{statusMsg}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your documents are used solely for accreditation processing.
      </p>
    </div>
  );
}
