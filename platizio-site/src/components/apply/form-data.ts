export type Residency = "" | "resident" | "nri";
export type AccountType = "" | "individual" | "joint";
export type Eligibility = "" | "networth" | "hybrid" | "income";
export type CertMethod = "" | "ca" | "platizio";
export type Validity = "" | "twoyear" | "threeyear";
export type DocPrefix = "nw" | "hy" | "in" | "ca";

// ── Personal-detail option lists (accreditation form) ──
export const GENDERS = ["Male", "Female", "Other"] as const;

export const OCCUPATIONS = [
  "Central Govt Employee",
  "State Govt Employee",
  "Corporate/Private Employee",
  "Retired",
  "House Wife",
  "Student",
  "Professional",
  "Agriculturist",
] as const;

// ── Payment (Razorpay) ──
// The "payable now" processing fee per form, in rupees. GST is added on top
// (the fee cards quote amounts "+GST"). NDML fees stay payable later.
export const GST_RATE = 0.18;
export const PROCESSING_FEE = {
  accreditation: 2000,
  netWorth: { twoyear: 7000, threeyear: 9000 },
} as const;

/** Amount payable now = processing fee × (1 + GST), in paise (integer). */
export function payablePaise(processingRupees: number): number {
  return Math.round(processingRupees * (1 + GST_RATE) * 100);
}

/** Formats paise as "₹8,260" (Indian grouping) for button labels. */
export function formatRupees(paise: number): string {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

export type DocField = {
  id: string;
  label: string;
  /** Muted inline note rendered after the label, e.g. "(recommended)" */
  note?: string;
  hint?: string;
  /** Muted note rendered below the upload button, e.g. accepted document types */
  footnote?: string;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  /** Row only shown for 3-year certificates */
  prevYear?: boolean;
};

export type DocCategory = {
  title: string;
  required?: boolean;
  /** Static description; ITR categories get a dynamic one instead */
  desc?: string;
  isItr?: boolean;
  fields: DocField[];
};

const ITR_CATEGORY = (prefix: DocPrefix): DocCategory => ({
  title: "Income Tax Returns",
  required: true,
  isItr: true,
  fields: [
    { id: `${prefix}_itr`, label: "Latest Year ITR", required: true, accept: ".pdf" },
    { id: `${prefix}_itr_prev`, label: "Previous Year ITR", required: true, accept: ".pdf", prevYear: true },
  ],
});

export const DOC_SECTIONS: Record<DocPrefix, DocCategory[]> = {
  nw: [
    ITR_CATEGORY("nw"),
    {
      title: "Financial Assets",
      required: true,
      desc: "Count toward both net worth and financial assets threshold. Upload at least one document.",
      fields: [
        {
          id: "nw_cas",
          label: "CAS Statement — NSDL / CDSL",
          note: "(recommended)",
          hint: "Covers all DEMAT holdings, mutual funds & NPS · no older than 1 month",
          accept: ".pdf",
        },
        {
          id: "nw_pms",
          label: "PMS / AIF / SIF / Unlisted Shares Statements",
          hint: "No older than 3 months · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
        {
          id: "nw_bank",
          label: "Bank Statements",
          hint: "Savings accounts, Fixed Deposits · no older than 1 month · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
        { id: "nw_pf", label: "Provident Fund Statements (EPF / PPF)", accept: ".pdf", multiple: true },
        { id: "nw_intl", label: "International Equities", hint: "Equities held abroad", accept: ".pdf", multiple: true },
      ],
    },
    {
      title: "Non-Financial Assets",
      desc: "Count toward net worth only (not financial assets threshold). Upload if applicable.",
      fields: [
        {
          id: "nw_realestate_proof",
          label: "Real Estate — Ownership Proof",
          hint: "Excluding primary residence (as per SEBI regulations) · multiple files accepted",
          accept: ".pdf,image/jpeg,image/png",
          multiple: true,
        },
        {
          id: "nw_realestate_value",
          label: "Real Estate — Latest Ready Reckoner Value",
          hint: "For each property listed above · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
        { id: "nw_gold", label: "Gold Valuation Certificate", hint: "No older than 3 months", accept: ".pdf" },
        { id: "nw_jewellery", label: "Jewellery Valuation Certificate", hint: "No older than 3 months", accept: ".pdf" },
      ],
    },
    {
      title: "Liabilities",
      desc: "Deducted from net worth. Upload if applicable.",
      fields: [
        {
          id: "nw_loans",
          label: "Loan Statements / Balance Sheet",
          note: "(if any)",
          hint: "Home loans, personal loans, or other outstanding dues · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
      ],
    },
  ],
  hy: [
    ITR_CATEGORY("hy"),
    {
      title: "Financial Assets",
      required: true,
      desc: "Count toward both net worth and financial assets threshold. Upload at least one document.",
      fields: [
        {
          id: "hy_cas",
          label: "CAS Statement — NSDL / CDSL",
          note: "(recommended)",
          hint: "Covers all DEMAT holdings, mutual funds & NPS · no older than 1 month",
          accept: ".pdf",
        },
        {
          id: "hy_pms",
          label: "PMS / AIF / SIF / Unlisted Shares Statements",
          hint: "No older than 3 months · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
        {
          id: "hy_bank",
          label: "Bank Statements",
          hint: "Savings accounts, Fixed Deposits · no older than 1 month · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
        { id: "hy_pf", label: "Provident Fund Statements (EPF / PPF)", accept: ".pdf", multiple: true },
      ],
    },
    {
      title: "Non-Financial Assets",
      desc: "Count toward net worth only. Upload if applicable.",
      fields: [
        {
          id: "hy_realestate",
          label: "Real Estate — Ownership Proof & Ready Reckoner Value",
          hint: "Excluding primary residence · provide both documents per property · multiple files accepted",
          accept: ".pdf,image/jpeg,image/png",
          multiple: true,
        },
        {
          id: "hy_gold",
          label: "Gold / Jewellery Valuation Certificates",
          hint: "No older than 3 months · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
      ],
    },
    {
      title: "Liabilities",
      desc: "Deducted from net worth. Upload if applicable.",
      fields: [
        {
          id: "hy_loans",
          label: "Loan Statements / Balance Sheet",
          note: "(if any)",
          hint: "Home loans, personal loans, or other outstanding dues · multiple files accepted",
          accept: ".pdf",
          multiple: true,
        },
      ],
    },
  ],
  in: [ITR_CATEGORY("in")],
  ca: [
    ITR_CATEGORY("ca"),
    {
      title: "Net Worth Certificate",
      required: true,
      desc: "Certificate issued by your CA attesting to your net worth as per SEBI guidelines. PDF format only.",
      fields: [{ id: "ca_nw_cert", label: "Net Worth Certificate", required: true, accept: ".pdf" }],
    },
  ],
};

// ── Accreditation Application — document categories ──
// The path-specific proof depends on the eligibility path:
//   • Net Worth path → Net Worth Certificate
//   • Income path    → Income Tax Returns (as per certificate validity)
//   • Hybrid path    → BOTH the ITR and the Net Worth Certificate
// The common docs (Identity Proof, Marriage Certificate if joint, Signed
// Undertakings) are required for every path.

// Net Worth Certificate — required for Net Worth & Hybrid paths
export const ACC_NW_CERT_DOC: DocCategory = {
  title: "Net Worth Certificate",
  required: true,
  desc: "Net Worth Certificate issued by a Chartered Accountant as per SEBI guidelines. Must be dated within the last 6 months. PDF format only.",
  fields: [{ id: "acc_nw_cert", label: "Net Worth Certificate", required: true, accept: ".pdf" }],
};

// Income Tax Returns — required for Income & Hybrid paths (previous year added for 3-year certificates)
export const ACC_ITR_DOC: DocCategory = {
  title: "Income Tax Returns",
  required: true,
  isItr: true,
  fields: [
    { id: "acc_itr", label: "Latest Year ITR", required: true, accept: ".pdf" },
    { id: "acc_itr_prev", label: "Previous Year ITR", required: true, accept: ".pdf", prevYear: true },
  ],
};

// Identity Proof — required for every path
export const ACC_IDENTITY_DOC: DocCategory = {
  title: "Identity Proof",
  required: true,
  desc: "Copy of PAN and a valid ID proof are both mandatory.",
  fields: [
    { id: "acc_pan", label: "Copy of PAN", required: true, accept: ".pdf,image/jpeg,image/png" },
    {
      id: "acc_aadhaar",
      label: "Valid ID Proof",
      required: true,
      footnote: "Accepted IDs: Aadhaar Card, Driver's License, Passport, Voter's ID Card.",
      accept: ".pdf,image/jpeg,image/png",
    },
  ],
};

// Signed Undertakings — required for every path
export const ACC_UNDERTAKINGS_DOC: DocCategory = {
  title: "Signed Undertakings",
  required: true,
  desc: "Signed undertakings as per SEBI-approved templates. Multiple files accepted.",
  fields: [
    { id: "acc_undertakings", label: "Signed Undertakings", required: true, multiple: true, accept: ".pdf" },
  ],
};

// Inserted before "Signed Undertakings" only for Joint – Spouse applications.
export const ACC_MARRIAGE_DOC: DocCategory = {
  title: "Marriage Certificate",
  required: true,
  desc: "Required for Joint – Spouse applications to establish the co-applicant relationship.",
  fields: [
    { id: "acc_marriage", label: "Marriage Certificate", required: true, accept: ".pdf,image/jpeg,image/png" },
  ],
};

export const TNC_POINTS = [
  "The information, declarations, and documents submitted by me are true, correct, complete, and belong to me / the applicant entity.",
  "I understand that submission of this application does not guarantee grant of Accredited Investor status, and the final approval shall be subject to verification and approval by the relevant accreditation agency and applicable regulatory framework.",
  "I voluntarily consent to the collection, storage, processing, verification, and use of my personal and financial information, including PAN, KYC details, income proofs, net worth documents, investment holdings, bank details, and supporting documents, for the purpose of processing my accreditation application.",
  "I authorize the platform to retrieve, verify, and process my KYC information through KRA systems, OTP verification, PAN validation systems, and other authorised verification mechanisms, wherever applicable.",
  "I understand and agree that my information and documents may be shared with accreditation agencies, verification service providers, technology vendors, payment gateways, regulators, auditors, and other authorised third parties strictly for the purpose of accreditation processing, compliance, operational support, fraud prevention, or legal/regulatory requirements.",
  "I acknowledge that electronic consent, OTP authentication, digital acceptance, and online submission through the portal shall constitute valid and binding consent and authorization.",
  "I agree not to upload forged, misleading, manipulated, or unauthorized documents and understand that any false declaration may lead to rejection of the application, suspension of access, reporting to authorities, or other legal action.",
  "I understand that the platform may retain and process my information for such period as may be required under applicable laws, regulatory requirements, audit obligations, dispute resolution, fraud prevention, and operational purposes in accordance with its privacy and data retention policies.",
  "I understand and agree that if my application is not processed further, abandoned, rejected, or remains incomplete, my uploaded personal and financial data and supporting documents may be securely deleted or destroyed by the platform after 30 days, subject to applicable legal and regulatory retention requirements.",
  "I confirm that I have read and understood the Privacy Policy and Terms & Conditions of the platform and agree to be bound by them.",
];

export const TNC_JURISDICTION =
  "Any disputes, claims, grievances, or matters arising out of or relating to the use of the platform or accreditation application process shall be subject to the exclusive jurisdiction of the courts located in Delhi, India under the governing law of India.";

export const SAMPLE_FIELDS: Record<string, string> = {
  fullName: "Arjun Mehta",
  organization: "Mehta Capital Advisors LLP",
  emailAddress: "arjun.mehta@mehtacapital.in",
  phoneNumber: "+91 98765 43210",
  panCard: "ABCPM1234A",
  gender: "Male",
  occupation: "Professional",
  currAddr1: "14B, Palm Grove Residency",
  currAddr2: "Sector 62, NOIDA",
  currCity: "Noida",
  currCountry: "India",
  currPincode: "201309",
};
