"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Loader2, Zap } from "lucide-react";
import { COUNTRIES, WEB_APP_URL } from "@/lib/site";
import {
  AccountType,
  CertMethod,
  DocCategory,
  DocField,
  DocPrefix,
  DOC_SECTIONS,
  Eligibility,
  Residency,
  SAMPLE_FIELDS,
  TNC_JURISDICTION,
  TNC_POINTS,
  Validity,
} from "./form-data";

// ─────────────────────────────────────────────────────────────────────────────
//  Small building blocks
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-9 mb-5 rounded-lg bg-gradient-to-r from-brand-deep to-brand px-4 py-2.5 text-[13px] font-bold tracking-wider text-white uppercase first:mt-0">
      {children}
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 mb-3 border-b border-border pb-2 text-[13px] font-bold text-brand">
      {children}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p data-form-error className="mt-1.5 text-xs font-medium text-red-600">
      {msg}
    </p>
  );
}

function TextField({
  id,
  label,
  required,
  hint,
  error,
  value,
  onChange,
  ...props
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-foreground/80">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="h-10 bg-card"
        {...props}
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
      <FieldError msg={error} />
    </div>
  );
}

function CountryField({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-foreground/80">
        Country
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.length > 1 && <option value="">Select country</option>}
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

function OptionCard({
  selected,
  onSelect,
  title,
  children,
  className = "",
}: {
  selected: boolean;
  onSelect: () => void;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? "border-brand bg-accent/50 shadow-md shadow-brand/10"
          : "border-border bg-card hover:border-brand/40 hover:shadow-sm"
      } ${className}`}
    >
      <span
        className={`absolute top-3 right-3 flex size-5 items-center justify-center rounded-full border-2 transition-all ${
          selected ? "border-brand bg-brand text-white" : "border-input bg-card text-transparent"
        }`}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <div className="pr-7 text-[15px] font-bold">{title}</div>
      {children}
    </button>
  );
}

function CardError({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <p data-form-error className="mt-2 text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Form internals
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FIELDS: Record<string, string> = {
  fullName: "", organization: "", emailAddress: "", phoneNumber: "",
  panCard: "", aadhaarNumber: "",
  currAddr1: "", currAddr2: "", currCity: "", currCountry: "India", currPincode: "",
  permAddr1: "", permAddr2: "", permCity: "", permCountry: "India", permPincode: "",
  sp_fullName: "", sp_organization: "", sp_emailAddress: "", sp_phoneNumber: "",
  sp_panCard: "", sp_aadhaarNumber: "",
  sp_currAddr1: "", sp_currAddr2: "", sp_currCity: "", sp_currCountry: "India", sp_currPincode: "",
  sp_permAddr1: "", sp_permAddr2: "", sp_permCity: "", sp_permCountry: "India", sp_permPincode: "",
};

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toBase64 = (file: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => res(r.result as string);
    r.onerror = (err) => rej(err);
  });

export function ApplicationForm() {
  // Remounting FormInner resets every field, file input and selection at once
  const [resetKey, setResetKey] = useState(0);
  return <FormInner key={resetKey} onRestart={() => setResetKey((k) => k + 1)} />;
}

function FormInner({ onRestart }: { onRestart: () => void }) {
  const [page, setPage] = useState<1 | 2>(1);
  const [residency, setResidency] = useState<Residency>("");
  const [accountType, setAccountType] = useState<AccountType>("");
  const [eligibility, setEligibility] = useState<Eligibility>("");
  const [certMethod, setCertMethod] = useState<CertMethod>("");
  const [validity, setValidity] = useState<Validity>("");
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [tnc, setTnc] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [done, setDone] = useState(false);

  const filesRef = useRef<Record<string, File[]>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const isJoint = accountType === "joint";
  const isThreeYear = validity === "threeyear";
  const needsCertMethod = eligibility === "networth" || eligibility === "hybrid";
  const countryOptions = residency === "nri" ? COUNTRIES : ["India"];
  const phonePlaceholder = residency === "nri" ? "+1 / +44 / +971 …" : "+91 XXXXX XXXXX";

  // Which document section is active (mirrors the original updateDocSection logic)
  const activePrefix: DocPrefix | "" =
    !eligibility || !validity
      ? ""
      : eligibility === "income"
        ? "in"
        : !certMethod
          ? ""
          : certMethod === "ca"
            ? "ca"
            : eligibility === "networth"
              ? "nw"
              : "hy";

  const pathLabel =
    eligibility === "networth" ? "Net Worth" : eligibility === "hybrid" ? "Hybrid" : "Income";
  const validityLabel = isThreeYear ? "3-Year" : "2-Year";

  const setField = (id: string, v: string) => setFields((f) => ({ ...f, [id]: v }));
  const bind = (id: string) => ({ value: fields[id] ?? "", onChange: (v: string) => setField(id, v) });
  const clearError = (key: string) =>
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });

  // "Combined" label prefix for Joint – Spouse applications
  const dl = (label: string) => (isJoint ? `Combined ${label}` : label);

  const scrollToFirstError = () =>
    requestAnimationFrame(() => {
      document
        .querySelector("[data-form-error]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

  // ── Selections ──
  const selectResidency = (type: Exclude<Residency, "">) => {
    setResidency(type);
    clearError("appType");
    const v = type === "nri" ? "" : "India";
    setFields((f) => ({
      ...f,
      currCountry: v, permCountry: v, sp_currCountry: v, sp_permCountry: v,
    }));
  };

  const selectAccountType = (type: Exclude<AccountType, "">) => {
    setAccountType(type);
    clearError("accountType");
  };

  const selectEligibility = (path: Exclude<Eligibility, "">) => {
    setEligibility(path);
    setCertMethod("");
    clearError("eligibility");
    clearError("certMethod");
  };

  const selectCertMethod = (m: Exclude<CertMethod, "">) => {
    setCertMethod(m);
    clearError("certMethod");
  };

  const selectValidity = (v: Exclude<Validity, "">) => {
    setValidity(v);
    clearError("validity");
  };

  const copyCurrentAddress = () =>
    setFields((f) => ({
      ...f,
      permAddr1: f.currAddr1, permAddr2: f.currAddr2, permCity: f.currCity,
      permCountry: f.currCountry, permPincode: f.currPincode,
    }));

  const copySpouseAddress = () =>
    setFields((f) => ({
      ...f,
      sp_permAddr1: f.sp_currAddr1, sp_permAddr2: f.sp_currAddr2, sp_permCity: f.sp_currCity,
      sp_permCountry: f.sp_currCountry, sp_permPincode: f.sp_currPincode,
    }));

  const fillSample = () => {
    setResidency("resident");
    setAccountType("individual");
    setFields((f) => ({
      ...f,
      ...SAMPLE_FIELDS,
      permAddr1: SAMPLE_FIELDS.currAddr1,
      permAddr2: SAMPLE_FIELDS.currAddr2,
      permCity: SAMPLE_FIELDS.currCity,
      permCountry: "India",
      permPincode: SAMPLE_FIELDS.currPincode,
    }));
    setEligibility("networth");
    setCertMethod("");
    setValidity("twoyear");
    setErrors({});
  };

  // ── Validation: page 1 ──
  const validatePage1 = () => {
    const errs: Record<string, string> = {};

    if (!residency) errs.appType = "Please select a residency status.";
    if (!accountType) errs.accountType = "Please select an account type.";

    const required: Array<[string, string]> = [
      ["fullName", "Full name is required."],
      ["emailAddress", "Email address is required."],
      ["phoneNumber", "Phone number is required."],
      ["panCard", "PAN card number is required."],
      ["currAddr1", "Current address line 1 is required."],
      ["permAddr1", "Permanent address line 1 is required."],
    ];
    required.forEach(([id, msg]) => {
      if (!fields[id]?.trim()) errs[id] = msg;
    });

    const pan = fields.panCard.trim().toUpperCase();
    if (pan && !PAN_RE.test(pan)) errs.panCard = "Invalid PAN format — expected ABCDE1234F.";

    const email = fields.emailAddress.trim();
    if (email && !EMAIL_RE.test(email)) errs.emailAddress = "Please enter a valid email address.";

    const aadhaar = fields.aadhaarNumber.replace(/\s/g, "");
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) errs.aadhaarNumber = "Aadhaar must be exactly 12 digits.";

    if (isJoint) {
      const spRequired: Array<[string, string]> = [
        ["sp_fullName", "Spouse full name is required."],
        ["sp_emailAddress", "Spouse email address is required."],
        ["sp_phoneNumber", "Spouse phone number is required."],
        ["sp_panCard", "Spouse PAN card number is required."],
        ["sp_currAddr1", "Spouse current address line 1 is required."],
        ["sp_permAddr1", "Spouse permanent address line 1 is required."],
      ];
      spRequired.forEach(([id, msg]) => {
        if (!fields[id]?.trim()) errs[id] = msg;
      });

      const spPan = fields.sp_panCard.trim().toUpperCase();
      if (spPan && !PAN_RE.test(spPan)) errs.sp_panCard = "Invalid PAN format — expected ABCDE1234F.";

      const spEmail = fields.sp_emailAddress.trim();
      if (spEmail && !EMAIL_RE.test(spEmail)) errs.sp_emailAddress = "Please enter a valid email address.";

      const spAadhaar = fields.sp_aadhaarNumber.replace(/\s/g, "");
      if (spAadhaar && !/^\d{12}$/.test(spAadhaar))
        errs.sp_aadhaarNumber = "Spouse Aadhaar must be exactly 12 digits.";
    }

    if (!tnc) errs.tnc = "You must agree to the Terms & Conditions to proceed.";

    setErrors(errs);
    if (Object.keys(errs).length) {
      scrollToFirstError();
      return false;
    }
    return true;
  };

  // ── Validation: page 2 ──
  const validatePage2 = () => {
    const errs: Record<string, string> = {};

    if (!eligibility) errs.eligibility = "Please select an eligibility path.";
    if (needsCertMethod && !certMethod) errs.certMethod = "Please select a certification method.";
    if (!validity) errs.validity = "Please select a certificate validity period.";

    if (needsCertMethod && certMethod === "ca" && !filesRef.current.ca_nw_cert?.[0]) {
      errs.ca_nw_cert = "Net Worth Certificate is required.";
    }

    if (activePrefix) {
      if (!filesRef.current[`${activePrefix}_itr`]?.[0]) {
        errs[`${activePrefix}_itr`] = "Latest year ITR is required.";
      }
      if (isThreeYear && !filesRef.current[`${activePrefix}_itr_prev`]?.[0]) {
        errs[`${activePrefix}_itr_prev`] = "Previous year ITR is required for a 3-year certificate.";
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length) {
      scrollToFirstError();
      setStatusMsg("Please fix the errors above before submitting.");
      return false;
    }
    setStatusMsg("");
    return true;
  };

  // ── Navigation ──
  const goToPage2 = () => {
    if (!validatePage1()) return;
    setPage(2);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const goToPage1 = () => {
    setPage(1);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  // ── File encoding & submit ──
  const encodeFile = async (id: string) => {
    const f = filesRef.current[id]?.[0];
    if (!f) return { data: "", name: "", type: "" };
    return { data: await toBase64(f), name: f.name, type: f.type };
  };

  const encodeMultiFile = async (id: string) => {
    const fs = filesRef.current[id] ?? [];
    return Promise.all(
      fs.map(async (f) => ({ data: await toBase64(f), name: f.name, type: f.type }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePage2()) return;

    setSubmitting(true);
    setStatusMsg("");

    try {
      let docs: Record<string, unknown> = {};
      const useCA = needsCertMethod && certMethod === "ca";

      if (useCA) {
        docs = {
          itr: await encodeFile("ca_itr"),
          itrPrev: isThreeYear ? await encodeFile("ca_itr_prev") : null,
          nwCertificate: await encodeFile("ca_nw_cert"),
        };
      } else if (eligibility === "networth") {
        docs = {
          itr: await encodeFile("nw_itr"),
          itrPrev: isThreeYear ? await encodeFile("nw_itr_prev") : null,
          cas: await encodeFile("nw_cas"),
          pms: await encodeMultiFile("nw_pms"),
          bank: await encodeMultiFile("nw_bank"),
          pf: await encodeMultiFile("nw_pf"),
          intl: await encodeMultiFile("nw_intl"),
          realEstateProof: await encodeMultiFile("nw_realestate_proof"),
          realEstateValue: await encodeMultiFile("nw_realestate_value"),
          gold: await encodeFile("nw_gold"),
          jewellery: await encodeFile("nw_jewellery"),
          loans: await encodeMultiFile("nw_loans"),
        };
      } else if (eligibility === "hybrid") {
        docs = {
          itr: await encodeFile("hy_itr"),
          itrPrev: isThreeYear ? await encodeFile("hy_itr_prev") : null,
          cas: await encodeFile("hy_cas"),
          pms: await encodeMultiFile("hy_pms"),
          bank: await encodeMultiFile("hy_bank"),
          pf: await encodeMultiFile("hy_pf"),
          realEstate: await encodeMultiFile("hy_realestate"),
          gold: await encodeMultiFile("hy_gold"),
          loans: await encodeMultiFile("hy_loans"),
        };
      } else if (eligibility === "income") {
        docs = {
          itr: await encodeFile("in_itr"),
          itrPrev: isThreeYear ? await encodeFile("in_itr_prev") : null,
        };
      }

      const payload = {
        accountType: isJoint ? "Joint – Spouse" : "Individual",
        applicationType: residency === "nri" ? "NRI" : "Indian Resident",
        certValidity: isThreeYear ? "3-Year" : "2-Year",
        fullName: fields.fullName,
        organization: fields.organization,
        emailAddress: fields.emailAddress,
        phoneNumber: fields.phoneNumber,
        panCard: fields.panCard.toUpperCase(),
        aadhaarNumber: fields.aadhaarNumber.replace(/\s/g, ""),
        currentAddress: {
          line1: fields.currAddr1, line2: fields.currAddr2, city: fields.currCity,
          country: fields.currCountry, pincode: fields.currPincode,
        },
        permanentAddress: {
          line1: fields.permAddr1, line2: fields.permAddr2, city: fields.permCity,
          country: fields.permCountry, pincode: fields.permPincode,
        },
        spouse: isJoint
          ? {
              fullName: fields.sp_fullName,
              organization: fields.sp_organization,
              emailAddress: fields.sp_emailAddress,
              phoneNumber: fields.sp_phoneNumber,
              panCard: fields.sp_panCard.toUpperCase(),
              aadhaarNumber: fields.sp_aadhaarNumber.replace(/\s/g, ""),
              currentAddress: {
                line1: fields.sp_currAddr1, line2: fields.sp_currAddr2, city: fields.sp_currCity,
                country: fields.sp_currCountry, pincode: fields.sp_currPincode,
              },
              permanentAddress: {
                line1: fields.sp_permAddr1, line2: fields.sp_permAddr2, city: fields.sp_permCity,
                country: fields.sp_permCountry, pincode: fields.sp_permPincode,
              },
            }
          : null,
        eligibilityPath: pathLabel,
        certMethod:
          certMethod === "ca"
            ? "Net Worth by CA"
            : certMethod === "platizio"
              ? "Facilitated by Platizio"
              : "",
        documents: docs,
      };

      await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setDone(true);
    } catch (err) {
      console.error(err);
      setStatusMsg("✗ Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── ITR description text (mirrors the original configs) ──
  const itrDesc = (prefix: DocPrefix) => {
    if (prefix === "hy") {
      return isThreeYear
        ? "Upload the latest and previous year ITR (both required for a 3-year certificate). Counts as proof of income AND net worth. PDF format only."
        : "Upload the latest year ITR or ITR acknowledgement. Counts as proof of income AND net worth. PDF format only.";
    }
    if (prefix === "ca") {
      return isThreeYear
        ? "Upload the latest and previous year ITR (both required for a 3-year certificate). PDF format only."
        : "Upload the latest year ITR or acknowledgement. PDF format only.";
    }
    return isThreeYear
      ? "Upload the latest and previous year ITR or acknowledgements (both required for a 3-year certificate). PDF format only."
      : "Upload the latest year ITR or ITR acknowledgement. PDF format only.";
  };

  const infoBox = (prefix: DocPrefix) => {
    const itrLine = isThreeYear
      ? "Two years of ITR are required for a 3-year certificate."
      : "Latest year ITR is required.";
    switch (prefix) {
      case "ca":
        return (
          <>
            Documents for the <strong>{pathLabel}</strong> path ·{" "}
            <strong>{validityLabel} Certificate</strong> — Net Worth verified by your CA. {itrLine}
          </>
        );
      case "nw":
        return (
          <>
            Documents for the <strong>Net Worth</strong> path ·{" "}
            <strong>{validityLabel} Certificate</strong> — prove net worth ≥ ₹7.5 Crore (financial
            assets ≥ ₹3.75 Crore). {itrLine} Upload at least one financial asset statement.
          </>
        );
      case "hy":
        return (
          <>
            Documents for the <strong>Hybrid</strong> path ·{" "}
            <strong>{validityLabel} Certificate</strong> — prove annual income ≥ ₹1 Crore AND net
            worth ≥ ₹5 Crore (financial assets ≥ ₹2.5 Crore). ITR serves as both income proof and
            net worth documentation.{isThreeYear ? " Two years of ITR are required for a 3-year certificate." : ""}
          </>
        );
      case "in":
        return (
          <>
            Documents for the <strong>Income</strong> path ·{" "}
            <strong>{validityLabel} Certificate</strong> — prove annual income ≥ ₹2 Crore. {itrLine}
          </>
        );
    }
  };

  // ── File field renderer (all sections stay mounted so chosen files persist) ──
  const renderFileField = (f: DocField) => {
    if (f.prevYear && !(isThreeYear && activePrefix && f.id.startsWith(activePrefix))) {
      return null;
    }
    return (
      <div key={f.id} className="rounded-lg border border-dashed border-brand/40 bg-card p-4">
        <label htmlFor={f.id} className="block text-[13px] font-semibold text-foreground/80">
          {dl(f.label)}{" "}
          {f.note && <span className="font-normal text-muted-foreground">{f.note}</span>}
          {f.required && <span className="ml-0.5 text-brand">*</span>}
        </label>
        {f.hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{f.hint}</p>}
        <input
          id={f.id}
          type="file"
          accept={f.accept ?? ".pdf"}
          multiple={f.multiple}
          onChange={(e) => {
            filesRef.current[f.id] = Array.from(e.target.files ?? []);
            clearError(f.id);
          }}
          className="mt-2.5 block w-full text-xs text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-brand-deep hover:file:bg-brand hover:file:text-white file:transition-colors"
        />
        <FieldError msg={errors[f.id]} />
      </div>
    );
  };

  const renderDocSection = (prefix: DocPrefix, categories: DocCategory[]) => (
    <div key={prefix} className={activePrefix === prefix ? "block" : "hidden"}>
      <div className="mb-5 rounded-lg border border-brand/25 bg-accent/60 px-4 py-3 text-[13px] leading-relaxed text-brand-deep">
        {activePrefix === prefix && infoBox(prefix)}
      </div>
      {categories.map((cat) => (
        <div key={cat.title} className="mb-6">
          <div className="text-sm font-bold">
            {cat.title} {cat.required && <span className="text-red-600">*</span>}
          </div>
          <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
            {cat.isItr ? itrDesc(prefix) : cat.desc}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">{cat.fields.map(renderFileField)}</div>
        </div>
      ))}
    </div>
  );

  // ── Address block ──
  const addressBlock = (p: "curr" | "perm" | "sp_curr" | "sp_perm") => (
    <div className="space-y-4 rounded-xl border border-border bg-background/60 p-4">
      <TextField
        id={`${p}Addr1`}
        label="Address Line 1"
        required
        placeholder="House / Flat No., Street Name"
        error={errors[`${p}Addr1`]}
        {...bind(`${p}Addr1`)}
      />
      <TextField
        id={`${p}Addr2`}
        label="Address Line 2"
        placeholder="Area / Locality / Landmark (optional)"
        error={errors[`${p}Addr2`]}
        {...bind(`${p}Addr2`)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField id={`${p}City`} label="City" placeholder="City" {...bind(`${p}City`)} />
        <CountryField
          id={`${p}Country`}
          options={countryOptions}
          {...bind(`${p}Country`)}
        />
        <TextField
          id={`${p}Pincode`}
          label="Pincode"
          placeholder="e.g. 110001"
          maxLength={10}
          inputMode="numeric"
          {...bind(`${p}Pincode`)}
        />
      </div>
    </div>
  );

  // ── Success screen ──
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand text-white"
        >
          <Check className="size-8" strokeWidth={3} />
        </motion.div>
        <h2 className="mt-6 text-2xl font-bold">Application submitted successfully!</h2>
        <p className="mt-2 text-muted-foreground">
          Thank you — our team will review your documents and reach out to you shortly.
        </p>
        <Button onClick={onRestart} variant="outline" size="lg" className="mt-8">
          Submit another application
        </Button>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Step indicator */}
      <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              page === 1 ? "bg-brand text-white" : "bg-brand-deep text-white"
            }`}
          >
            {page === 2 ? <Check className="size-4" strokeWidth={3} /> : "1"}
          </div>
          <span className={`text-xs font-semibold ${page === 1 ? "text-brand" : "text-brand-deep"}`}>
            Application Details
          </span>
        </div>
        <div className="relative mb-5 h-0.5 w-20 overflow-hidden rounded bg-border sm:w-28">
          <motion.div
            className="absolute inset-y-0 left-0 bg-brand"
            initial={false}
            animate={{ width: page === 2 ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              page === 2 ? "bg-brand text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className={`text-xs font-semibold ${page === 2 ? "text-brand" : "text-muted-foreground"}`}>
            Eligibility &amp; Documents
          </span>
        </div>
      </div>

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
              <motion.div
                key="page1"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                {/* ═══ 1 · Application Type ═══ */}
                <SectionHeader>1 · Application Type</SectionHeader>

                <SubLabel>Residency Status</SubLabel>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                  <OptionCard
                    selected={residency === "resident"}
                    onSelect={() => selectResidency("resident")}
                    title="Indian Resident"
                  >
                    <p className="mt-1 text-xs text-muted-foreground">
                      Indian citizen currently residing in India
                    </p>
                  </OptionCard>
                  <OptionCard
                    selected={residency === "nri"}
                    onSelect={() => selectResidency("nri")}
                    title="NRI"
                  >
                    <p className="mt-1 text-xs text-muted-foreground">
                      Non-Resident Indian based outside India
                    </p>
                  </OptionCard>
                </div>
                <CardError show={!!errors.appType}>{errors.appType}</CardError>

                {residency && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <SubLabel>Account Type</SubLabel>
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                      <OptionCard
                        selected={accountType === "individual"}
                        onSelect={() => selectAccountType("individual")}
                        title="Individual"
                      >
                        <p className="mt-1 text-xs text-muted-foreground">
                          Single applicant applying independently
                        </p>
                      </OptionCard>
                      <OptionCard
                        selected={accountType === "joint"}
                        onSelect={() => selectAccountType("joint")}
                        title="Joint – Spouse"
                      >
                        <p className="mt-1 text-xs text-muted-foreground">
                          Joint application with your spouse as co-applicant
                        </p>
                      </OptionCard>
                    </div>
                    <CardError show={!!errors.accountType}>{errors.accountType}</CardError>
                  </motion.div>
                )}

                {/* ═══ 2 · Basic Details ═══ */}
                <SectionHeader>2 · Basic Details</SectionHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="fullName" label="Full Name" required placeholder="As per PAN card"
                    error={errors.fullName} {...bind("fullName")}
                  />
                  <TextField
                    id="organization" label="Organization" placeholder="Company / Firm (optional)"
                    {...bind("organization")}
                  />
                  <TextField
                    id="emailAddress" label="Email Address" required type="email"
                    placeholder="you@example.com" error={errors.emailAddress} {...bind("emailAddress")}
                  />
                  <TextField
                    id="phoneNumber" label="Phone Number" required type="tel"
                    placeholder={phonePlaceholder} error={errors.phoneNumber} {...bind("phoneNumber")}
                  />
                  <TextField
                    id="panCard" label="PAN Card Number" required placeholder="ABCDE1234F"
                    maxLength={10} className="h-10 bg-card uppercase"
                    hint="Format: 5 letters · 4 digits · 1 letter"
                    error={errors.panCard} {...bind("panCard")}
                  />
                  <TextField
                    id="aadhaarNumber" label="Aadhaar Number" placeholder="XXXX XXXX XXXX"
                    maxLength={14} inputMode="numeric" hint="12-digit Aadhaar number (optional)"
                    error={errors.aadhaarNumber} {...bind("aadhaarNumber")}
                  />
                </div>

                <SubLabel>Current Address</SubLabel>
                {addressBlock("curr")}

                <SubLabel>Permanent Address</SubLabel>
                <button
                  type="button"
                  onClick={copyCurrentAddress}
                  className="mb-3 inline-flex items-center gap-1 rounded-md border border-brand/30 bg-accent/60 px-3 py-1.5 text-xs font-semibold text-brand-deep transition-colors hover:bg-accent"
                >
                  ↓ Same as Current Address
                </button>
                {addressBlock("perm")}

                {/* Spouse details (Joint – Spouse only) */}
                {isJoint && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <SubLabel>— Spouse / Co-Applicant Details —</SubLabel>
                    <p className="mb-4 text-xs text-muted-foreground">
                      Please provide your spouse&apos;s details exactly as they appear on official
                      documents.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        id="sp_fullName" label="Full Name" required placeholder="As per PAN card"
                        error={errors.sp_fullName} {...bind("sp_fullName")}
                      />
                      <TextField
                        id="sp_organization" label="Organization" placeholder="Company / Firm (optional)"
                        {...bind("sp_organization")}
                      />
                      <TextField
                        id="sp_emailAddress" label="Email Address" required type="email"
                        placeholder="spouse@example.com" error={errors.sp_emailAddress}
                        {...bind("sp_emailAddress")}
                      />
                      <TextField
                        id="sp_phoneNumber" label="Phone Number" required type="tel"
                        placeholder={phonePlaceholder} error={errors.sp_phoneNumber}
                        {...bind("sp_phoneNumber")}
                      />
                      <TextField
                        id="sp_panCard" label="PAN Card Number" required placeholder="ABCDE1234F"
                        maxLength={10} className="h-10 bg-card uppercase"
                        hint="Format: 5 letters · 4 digits · 1 letter"
                        error={errors.sp_panCard} {...bind("sp_panCard")}
                      />
                      <TextField
                        id="sp_aadhaarNumber" label="Aadhaar Number" placeholder="XXXX XXXX XXXX"
                        maxLength={14} inputMode="numeric" hint="12-digit Aadhaar number (optional)"
                        error={errors.sp_aadhaarNumber} {...bind("sp_aadhaarNumber")}
                      />
                    </div>

                    <SubLabel>Spouse Current Address</SubLabel>
                    {addressBlock("sp_curr")}

                    <SubLabel>Spouse Permanent Address</SubLabel>
                    <button
                      type="button"
                      onClick={copySpouseAddress}
                      className="mb-3 inline-flex items-center gap-1 rounded-md border border-brand/30 bg-accent/60 px-3 py-1.5 text-xs font-semibold text-brand-deep transition-colors hover:bg-accent"
                    >
                      ↓ Same as Spouse Current Address
                    </button>
                    {addressBlock("sp_perm")}
                  </motion.div>
                )}

                {/* ═══ Terms & Conditions ═══ */}
                <SectionHeader>Terms &amp; Conditions</SectionHeader>

                <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background/60 p-5 text-xs leading-relaxed text-muted-foreground">
                  <h4 className="mb-2 text-[13px] font-bold text-brand-deep">
                    Platizio – Accredited Investor Application · Declaration &amp; Consent
                  </h4>
                  <p className="mb-2">
                    By proceeding with this application, I hereby acknowledge, confirm, and agree
                    that:
                  </p>
                  <ol className="list-decimal space-y-1.5 pl-5">
                    {TNC_POINTS.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ol>
                  <p className="mt-3 text-[11px] font-medium text-brand-deep">{TNC_JURISDICTION}</p>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={tnc}
                    onCheckedChange={(v) => {
                      setTnc(v === true);
                      if (v === true) clearError("tnc");
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-snug">
                    I Agree to the <strong>Terms &amp; Conditions</strong>,{" "}
                    <strong>Privacy Policy</strong>, and consent for processing of my information
                    for accreditation purposes.
                  </span>
                </label>
                <CardError show={!!errors.tnc}>{errors.tnc}</CardError>

                <Button
                  type="button"
                  onClick={goToPage2}
                  size="lg"
                  className="mt-7 h-12 w-full bg-brand text-base hover:bg-brand-deep"
                >
                  Next → Eligibility &amp; Documents
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="page2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={goToPage1}
                  className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-deep"
                >
                  <ArrowLeft className="size-4" /> Back to Application Details
                </button>

                {/* ═══ 3 · Eligibility Path ═══ */}
                <SectionHeader>3 · Eligibility Path</SectionHeader>
                <p className="mb-4 text-xs text-muted-foreground">
                  Select how you meet SEBI&apos;s Accredited Investor criteria.
                </p>

                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
                  <OptionCard
                    selected={eligibility === "networth"}
                    onSelect={() => selectEligibility("networth")}
                    title="A. Net Worth"
                  >
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>· Net worth ≥ ₹7.5 Crore</li>
                      <li>· Financial assets ≥ ₹3.75 Crore</li>
                    </ul>
                  </OptionCard>
                  <OptionCard
                    selected={eligibility === "hybrid"}
                    onSelect={() => selectEligibility("hybrid")}
                    title="B. Hybrid"
                  >
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>· Annual income ≥ ₹1 Crore</li>
                      <li>· Net worth ≥ ₹5 Crore</li>
                      <li>· Financial assets ≥ ₹2.5 Crore</li>
                    </ul>
                  </OptionCard>
                  <OptionCard
                    selected={eligibility === "income"}
                    onSelect={() => selectEligibility("income")}
                    title="C. Income"
                  >
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>· Annual income ≥ ₹2 Crore</li>
                    </ul>
                  </OptionCard>
                </div>
                <CardError show={!!errors.eligibility}>{errors.eligibility}</CardError>

                {/* 3.2 · Net Worth Certificate method */}
                {needsCertMethod && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <SubLabel>3.2 · Net Worth Certificate</SubLabel>
                    <p className="mb-3 text-xs text-muted-foreground">
                      How will your Net Worth be certified?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                      <OptionCard
                        selected={certMethod === "ca"}
                        onSelect={() => selectCertMethod("ca")}
                        title="Net Worth by Your CA"
                      >
                        <p className="mt-1 text-xs text-muted-foreground">
                          Your Chartered Accountant provides the Net Worth Certificate directly
                        </p>
                      </OptionCard>
                      <OptionCard
                        selected={certMethod === "platizio"}
                        onSelect={() => selectCertMethod("platizio")}
                        title="Facilitated by Platizio"
                      >
                        <p className="mt-1 text-xs text-muted-foreground">
                          Platizio arranges your Net Worth Certificate through empanelled CAs
                        </p>
                      </OptionCard>
                    </div>
                    <CardError show={!!errors.certMethod}>{errors.certMethod}</CardError>
                  </motion.div>
                )}

                {/* ═══ 4 · Certificate Validity ═══ */}
                <SectionHeader>4 · Certificate Validity</SectionHeader>
                <p className="mb-4 text-xs text-muted-foreground">
                  Select the CDSL Accredited Investor Certificate validity period.
                </p>

                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                  {(
                    [
                      { v: "twoyear", name: "2-Year Certificate", ca: "₹9,000", cdsl: "₹10,000" },
                      { v: "threeyear", name: "3-Year Certificate", ca: "₹13,500", cdsl: "₹14,500" },
                    ] as const
                  ).map((plan) => (
                    <OptionCard
                      key={plan.v}
                      selected={validity === plan.v}
                      onSelect={() => selectValidity(plan.v)}
                      title={plan.name}
                    >
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground/70">CA fees:</span>{" "}
                          <span className="font-bold text-brand-deep">{plan.ca} + GST</span>{" "}
                          <span className="italic">payable now</span>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground/70">CDSL fees:</span>{" "}
                          <span className="font-bold text-brand-deep">{plan.cdsl} + GST</span>{" "}
                          <span className="italic">payable later</span>
                        </div>
                      </div>
                    </OptionCard>
                  ))}
                </div>
                <CardError show={!!errors.validity}>{errors.validity}</CardError>

                {/* ═══ 5 · Documents Upload ═══ */}
                <SectionHeader>5 · Documents Upload</SectionHeader>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG · Max 5 MB per file · Please self-attest physical
                  documents before uploading.
                </p>
                {!activePrefix && (
                  <p className="mb-4 text-xs font-semibold text-brand">
                    ← Select an eligibility path
                    {needsCertMethod ? ", certification method" : ""} and certificate validity
                    above to see the required documents.
                  </p>
                )}

                <div className="mt-4">
                  {(Object.entries(DOC_SECTIONS) as [DocPrefix, DocCategory[]][]).map(
                    ([prefix, cats]) => renderDocSection(prefix, cats)
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="mt-7 h-12 w-full bg-brand text-base hover:bg-brand-deep"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" data-icon="inline-start" /> Uploading &amp;
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application <ArrowRight data-icon="inline-end" />
                    </>
                  )}
                </Button>

                {statusMsg && (
                  <p className="mt-4 text-center text-sm font-semibold text-red-600">{statusMsg}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <CircleCheck className="size-3.5 text-brand" />
        Your documents are used solely for accreditation processing.
      </p>
    </div>
  );
}
