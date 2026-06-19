"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { COUNTRIES } from "@/lib/site";
import {
  AccountType,
  DocField,
  Residency,
  SAMPLE_FIELDS,
  TNC_JURISDICTION,
  TNC_POINTS,
} from "./form-data";

// ─────────────────────────────────────────────────────────────────────────────
//  Constants & helpers
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_FIELDS: Record<string, string> = {
  fullName: "", organization: "", emailAddress: "", phoneNumber: "",
  panCard: "", aadhaarNumber: "",
  currAddr1: "", currAddr2: "", currCity: "", currCountry: "India", currPincode: "",
  permAddr1: "", permAddr2: "", permCity: "", permCountry: "India", permPincode: "",
  sp_fullName: "", sp_organization: "", sp_emailAddress: "", sp_phoneNumber: "",
  sp_panCard: "", sp_aadhaarNumber: "",
  sp_currAddr1: "", sp_currAddr2: "", sp_currCity: "", sp_currCountry: "India", sp_currPincode: "",
  sp_permAddr1: "", sp_permAddr2: "", sp_permCity: "", sp_permCountry: "India", sp_permPincode: "",
};

export const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const scrollToFirstError = () =>
  requestAnimationFrame(() => {
    document.querySelector("[data-form-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

// ─────────────────────────────────────────────────────────────────────────────
//  UI primitives
// ─────────────────────────────────────────────────────────────────────────────

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-9 mb-5 rounded-lg bg-gradient-to-r from-brand-deep to-brand px-4 py-2.5 text-[13px] font-bold tracking-wider text-white uppercase first:mt-0">
      {children}
    </div>
  );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 mb-3 border-b border-border pb-2 text-[13px] font-bold text-brand">
      {children}
    </div>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p data-form-error className="mt-1.5 text-xs font-medium text-red-600">
      {msg}
    </p>
  );
}

export function TextField({
  id, label, required, hint, error, value, onChange, ...props
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

export function CountryField({
  id, value, options, onChange,
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
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}

export function OptionCard({
  selected, onSelect, title, children, className = "",
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

export function CardError({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <p data-form-error className="mt-2 text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

/** Single file-upload field used by both forms' document sections. */
export function FileField({
  field, error, combine = false, onFiles,
}: {
  field: DocField;
  error?: string;
  /** Prefix the label with "Combined " (Joint – Spouse applications). */
  combine?: boolean;
  onFiles: (id: string, files: File[]) => void;
}) {
  const label = combine ? `Combined ${field.label}` : field.label;
  return (
    <div className="rounded-lg border border-dashed border-brand/40 bg-card p-4">
      <label htmlFor={field.id} className="block text-[13px] font-semibold text-foreground/80">
        {label}{" "}
        {field.note && <span className="font-normal text-muted-foreground">{field.note}</span>}
        {field.required && <span className="ml-0.5 text-brand">*</span>}
      </label>
      {field.hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{field.hint}</p>}
      <input
        id={field.id}
        type="file"
        accept={field.accept ?? ".pdf"}
        multiple={field.multiple}
        onChange={(e) => onFiles(field.id, Array.from(e.target.files ?? []))}
        className="mt-2.5 block w-full text-xs text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-brand-deep hover:file:bg-brand hover:file:text-white file:transition-colors"
      />
      <FieldError msg={error} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Applicant state (Application Type + Basic Details + Spouse)
// ─────────────────────────────────────────────────────────────────────────────

export type ApplicantController = ReturnType<typeof useApplicant>;

export function useApplicant() {
  const [residency, setResidency] = useState<Residency>("");
  const [accountType, setAccountType] = useState<AccountType>("");
  const [fields, setFields] = useState(INITIAL_FIELDS);

  const isJoint = accountType === "joint";
  const countryOptions = residency === "nri" ? COUNTRIES : ["India"];
  const phonePlaceholder = residency === "nri" ? "+1 / +44 / +971 …" : "+91 XXXXX XXXXX";

  const setField = (id: string, v: string) => setFields((f) => ({ ...f, [id]: v }));
  const bind = (id: string) => ({ value: fields[id] ?? "", onChange: (v: string) => setField(id, v) });

  const selectResidency = (type: Exclude<Residency, "">) => {
    setResidency(type);
    const v = type === "nri" ? "" : "India";
    setFields((f) => ({ ...f, currCountry: v, permCountry: v, sp_currCountry: v, sp_permCountry: v }));
  };

  const selectAccountType = (type: Exclude<AccountType, "">) => setAccountType(type);

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

  /** Fills the applicant (page 1) portion with sample data. */
  const fillApplicantSample = () => {
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
  };

  return {
    residency, accountType, fields, isJoint, countryOptions, phonePlaceholder,
    setField, bind, selectResidency, selectAccountType,
    copyCurrentAddress, copySpouseAddress, fillApplicantSample,
  };
}

/** Validates the applicant (page 1) fields. Returns an errors map (T&C handled by the form). */
export function validateApplicant(ctrl: ApplicantController): Record<string, string> {
  const { fields, residency, accountType, isJoint } = ctrl;
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

  const phoneDigits = fields.phoneNumber.replace(/\D/g, "");
  if (fields.phoneNumber.trim() && (phoneDigits.length < 8 || phoneDigits.length > 15))
    errs.phoneNumber = "Please enter a valid phone number (8–15 digits).";

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

    const spPhoneDigits = fields.sp_phoneNumber.replace(/\D/g, "");
    if (fields.sp_phoneNumber.trim() && (spPhoneDigits.length < 8 || spPhoneDigits.length > 15))
      errs.sp_phoneNumber = "Please enter a valid spouse phone number (8–15 digits).";

    const spAadhaar = fields.sp_aadhaarNumber.replace(/\s/g, "");
    if (spAadhaar && !/^\d{12}$/.test(spAadhaar))
      errs.sp_aadhaarNumber = "Spouse Aadhaar must be exactly 12 digits.";
  }

  return errs;
}

/** Builds the shared applicant portion of the submit payload. */
export function buildApplicantPayload(ctrl: ApplicantController) {
  const { fields, residency, accountType, isJoint } = ctrl;
  return {
    accountType: isJoint ? "Joint – Spouse" : "Individual",
    applicationType: residency === "nri" ? "NRI" : "Indian Resident",
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
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Applicant step component (Application Type + Basic Details + Spouse)
// ─────────────────────────────────────────────────────────────────────────────

export function ApplicantStep({
  ctrl, errors, clearError, jointTitle = "Joint – Spouse", jointDesc = "Joint application with your spouse as co-applicant",
}: {
  ctrl: ApplicantController;
  errors: Record<string, string>;
  clearError: (key: string) => void;
  jointTitle?: string;
  jointDesc?: string;
}) {
  const { residency, accountType, isJoint, countryOptions, phonePlaceholder, bind, copyCurrentAddress, copySpouseAddress } = ctrl;

  // Phone fields: bind the value but sanitize on change so only valid phone
  // characters (digits, spaces, +, -, parentheses) are ever stored.
  const bindPhone = (id: string) => ({
    value: ctrl.fields[id] ?? "",
    onChange: (v: string) => ctrl.setField(id, v.replace(/[^\d+()\-\s]/g, "")),
  });

  const addressBlock = (p: "curr" | "perm" | "sp_curr" | "sp_perm") => (
    <div className="space-y-4 rounded-xl border border-border bg-background/60 p-4">
      <TextField id={`${p}Addr1`} label="Address Line 1" required placeholder="House / Flat No., Street Name" error={errors[`${p}Addr1`]} {...bind(`${p}Addr1`)} />
      <TextField id={`${p}Addr2`} label="Address Line 2" placeholder="Area / Locality / Landmark (optional)" {...bind(`${p}Addr2`)} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField id={`${p}City`} label="City" placeholder="City" {...bind(`${p}City`)} />
        <CountryField id={`${p}Country`} options={countryOptions} {...bind(`${p}Country`)} />
        <TextField id={`${p}Pincode`} label="Pincode" placeholder="e.g. 110001" maxLength={10} inputMode="numeric" {...bind(`${p}Pincode`)} />
      </div>
    </div>
  );

  return (
    <>
      {/* 1 · Application Type */}
      <SectionHeader>1 · Application Type</SectionHeader>

      <SubLabel>Residency Status</SubLabel>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
        <OptionCard
          selected={residency === "resident"}
          onSelect={() => { ctrl.selectResidency("resident"); clearError("appType"); }}
          title="Indian Resident"
        >
          <p className="mt-1 text-xs text-muted-foreground">Indian citizen currently residing in India</p>
        </OptionCard>
        <OptionCard
          selected={residency === "nri"}
          onSelect={() => { ctrl.selectResidency("nri"); clearError("appType"); }}
          title="NRI"
        >
          <p className="mt-1 text-xs text-muted-foreground">Non-Resident Indian based outside India</p>
        </OptionCard>
      </div>
      <CardError show={!!errors.appType}>{errors.appType}</CardError>

      {residency && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <SubLabel>Account Type</SubLabel>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
            <OptionCard
              selected={accountType === "individual"}
              onSelect={() => { ctrl.selectAccountType("individual"); clearError("accountType"); }}
              title="Individual"
            >
              <p className="mt-1 text-xs text-muted-foreground">Single applicant applying independently</p>
            </OptionCard>
            <OptionCard
              selected={accountType === "joint"}
              onSelect={() => { ctrl.selectAccountType("joint"); clearError("accountType"); }}
              title={jointTitle}
            >
              <p className="mt-1 text-xs text-muted-foreground">{jointDesc}</p>
            </OptionCard>
          </div>
          <CardError show={!!errors.accountType}>{errors.accountType}</CardError>
        </motion.div>
      )}

      {/* 2 · Basic Details */}
      <SectionHeader>2 · Basic Details</SectionHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="fullName" label="Full Name" required placeholder="As per PAN card" error={errors.fullName} {...bind("fullName")} />
        <TextField id="organization" label="Organization" placeholder="Company / Firm (optional)" {...bind("organization")} />
        <TextField id="emailAddress" label="Email Address" required type="email" placeholder="you@example.com" error={errors.emailAddress} {...bind("emailAddress")} />
        <TextField id="phoneNumber" label="Phone Number" required type="tel" inputMode="tel" maxLength={18} placeholder={phonePlaceholder} error={errors.phoneNumber} {...bindPhone("phoneNumber")} />
        <TextField id="panCard" label="PAN Card Number" required placeholder="ABCDE1234F" maxLength={10} className="h-10 bg-card uppercase" hint="Format: 5 letters · 4 digits · 1 letter" error={errors.panCard} {...bind("panCard")} />
        <TextField id="aadhaarNumber" label="Aadhaar Number" placeholder="XXXX XXXX XXXX" maxLength={14} inputMode="numeric" hint="12-digit Aadhaar number (optional)" error={errors.aadhaarNumber} {...bind("aadhaarNumber")} />
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

      {isJoint && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <SubLabel>— Spouse / Co-Applicant Details —</SubLabel>
          <p className="mb-4 text-xs text-muted-foreground">
            Please provide your spouse&apos;s details exactly as they appear on official documents.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="sp_fullName" label="Full Name" required placeholder="As per PAN card" error={errors.sp_fullName} {...bind("sp_fullName")} />
            <TextField id="sp_organization" label="Organization" placeholder="Company / Firm (optional)" {...bind("sp_organization")} />
            <TextField id="sp_emailAddress" label="Email Address" required type="email" placeholder="spouse@example.com" error={errors.sp_emailAddress} {...bind("sp_emailAddress")} />
            <TextField id="sp_phoneNumber" label="Phone Number" required type="tel" inputMode="tel" maxLength={18} placeholder={phonePlaceholder} error={errors.sp_phoneNumber} {...bindPhone("sp_phoneNumber")} />
            <TextField id="sp_panCard" label="PAN Card Number" required placeholder="ABCDE1234F" maxLength={10} className="h-10 bg-card uppercase" hint="Format: 5 letters · 4 digits · 1 letter" error={errors.sp_panCard} {...bind("sp_panCard")} />
            <TextField id="sp_aadhaarNumber" label="Aadhaar Number" placeholder="XXXX XXXX XXXX" maxLength={14} inputMode="numeric" hint="12-digit Aadhaar number (optional)" error={errors.sp_aadhaarNumber} {...bind("sp_aadhaarNumber")} />
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
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Terms & Conditions block
// ─────────────────────────────────────────────────────────────────────────────

export function TermsBlock({
  checked, onChange, error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  return (
    <>
      <SectionHeader>Terms &amp; Conditions</SectionHeader>

      <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background/60 p-5 text-xs leading-relaxed text-muted-foreground">
        <h4 className="mb-2 text-[13px] font-bold text-brand-deep">
          Platizio – Application · Declaration &amp; Consent
        </h4>
        <p className="mb-2">By proceeding with this application, I hereby acknowledge, confirm, and agree that:</p>
        <ol className="list-decimal space-y-1.5 pl-5">
          {TNC_POINTS.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] font-medium text-brand-deep">{TNC_JURISDICTION}</p>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
        <span className="text-sm leading-snug">
          I Agree to the <strong>Terms &amp; Conditions</strong>, <strong>Privacy Policy</strong>, and consent for
          processing of my information for accreditation purposes.
        </span>
      </label>
      <CardError show={!!error}>{error}</CardError>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Step indicator + success screen
// ─────────────────────────────────────────────────────────────────────────────

export function StepIndicator({ page, labels }: { page: 1 | 2; labels: [string, string] }) {
  return (
    <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${page === 1 ? "bg-brand text-white" : "bg-brand-deep text-white"}`}>
          {page === 2 ? <Check className="size-4" strokeWidth={3} /> : "1"}
        </div>
        <span className={`text-center text-xs font-semibold ${page === 1 ? "text-brand" : "text-brand-deep"}`}>{labels[0]}</span>
      </div>
      <div className="relative mb-5 h-0.5 w-20 overflow-hidden rounded bg-border sm:w-28">
        <motion.div className="absolute inset-y-0 left-0 bg-brand" initial={false} animate={{ width: page === 2 ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${page === 2 ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>2</div>
        <span className={`text-center text-xs font-semibold ${page === 2 ? "text-brand" : "text-muted-foreground"}`}>{labels[1]}</span>
      </div>
    </div>
  );
}

export function SuccessScreen({
  title, message, onRestart,
}: {
  title: string;
  message: string;
  onRestart: () => void;
}) {
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
      <h2 className="mt-6 text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <Button onClick={onRestart} variant="outline" size="lg" className="mt-8">
        Submit another application
      </Button>
    </motion.div>
  );
}

// Shared submit button label helper
export { Button };
