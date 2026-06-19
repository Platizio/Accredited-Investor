import { supabase, SUBMISSIONS_BUCKET } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────

/** Metadata recorded for every uploaded document (stored in the `documents` jsonb). */
export type FileMeta = { path: string; name: string; type: string; size: number };

export type Address = {
  line1: string;
  line2: string;
  city: string;
  country: string;
  pincode: string;
};

export type Spouse = {
  fullName: string;
  organization: string;
  emailAddress: string;
  phoneNumber: string;
  panCard: string;
  aadhaarNumber: string;
  currentAddress: Address;
  permanentAddress: Address;
};

/** The applicant portion produced by buildApplicantPayload() in form-core. */
export type ApplicantPayload = {
  accountType: string;
  applicationType: string;
  fullName: string;
  organization: string;
  emailAddress: string;
  phoneNumber: string;
  panCard: string;
  aadhaarNumber: string;
  currentAddress: Address;
  permanentAddress: Address;
  spouse: Spouse | null;
};

/** Maps each document slot to its uploaded file metadata (single, list, or absent). */
export type DocumentMap = Record<string, FileMeta | FileMeta[] | null>;

type FilesRef = { current: Record<string, File[]> };

/** Max accepted file size (bytes). Mirrors the bucket's server-side file_size_limit. */
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

/**
 * Generates a submission id. Uses crypto.randomUUID in secure contexts
 * (HTTPS / localhost); falls back to a Math.random-based UUID so the form
 * still works if the app is ever served over plain HTTP.
 */
export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  Storage uploads
// ─────────────────────────────────────────────────────────────────────────────

const sanitize = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(-120) || "file";

const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

/** Best-effort content type — falls back to the file extension when the browser reports none. */
function contentTypeOf(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MIME[ext] ?? "application/octet-stream";
}

async function uploadOne(dir: string, slot: string, index: number, file: File): Promise<FileMeta> {
  const path = `${dir}/${slot}-${index}-${sanitize(file.name)}`;
  const { error } = await supabase.storage.from(SUBMISSIONS_BUCKET).upload(path, file, {
    contentType: contentTypeOf(file),
    upsert: false,
  });
  if (error) throw new Error(`Upload failed for "${file.name}": ${error.message}`);
  return { path, name: file.name, type: file.type, size: file.size };
}

/**
 * File uploaders bound to a form's filesRef map and a per-submission storage
 * directory. Mirrors makeEncoders() in form-core, but uploads the real File to
 * Supabase Storage and returns its metadata instead of a base64 blob.
 */
export function makeUploaders(filesRef: FilesRef, dir: string) {
  const uploadFile = async (slot: string): Promise<FileMeta | null> => {
    const f = filesRef.current[slot]?.[0];
    return f ? uploadOne(dir, slot, 0, f) : null;
  };
  const uploadMultiFile = async (slot: string): Promise<FileMeta[]> => {
    const files = filesRef.current[slot] ?? [];
    return Promise.all(files.map((f, i) => uploadOne(dir, slot, i, f)));
  };
  return { uploadFile, uploadMultiFile };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Row inserts
// ─────────────────────────────────────────────────────────────────────────────

function applicantColumns(a: ApplicantPayload) {
  return {
    account_type: a.accountType,
    application_type: a.applicationType,
    full_name: a.fullName,
    organization: a.organization,
    email_address: a.emailAddress,
    phone_number: a.phoneNumber,
    pan_card: a.panCard,
    aadhaar_number: a.aadhaarNumber,
    current_address: a.currentAddress,
    permanent_address: a.permanentAddress,
    spouse: a.spouse,
  };
}

export async function submitNetWorth(args: {
  id: string;
  applicant: ApplicantPayload;
  certValidity: string;
  tncAccepted: boolean;
  documents: DocumentMap;
}): Promise<void> {
  const { error } = await supabase.from("net_worth_submissions").insert({
    id: args.id,
    ...applicantColumns(args.applicant),
    cert_validity: args.certValidity,
    tnc_accepted: args.tncAccepted,
    documents: args.documents,
  });
  if (error) throw new Error(`Could not save submission: ${error.message}`);
}

export async function submitAccreditation(args: {
  id: string;
  applicant: ApplicantPayload;
  eligibilityPath: string;
  certValidity: string;
  tncAccepted: boolean;
  documents: DocumentMap;
}): Promise<void> {
  const { error } = await supabase.from("accreditation_submissions").insert({
    id: args.id,
    ...applicantColumns(args.applicant),
    eligibility_path: args.eligibilityPath,
    cert_validity: args.certValidity,
    tnc_accepted: args.tncAccepted,
    documents: args.documents,
  });
  if (error) throw new Error(`Could not save submission: ${error.message}`);
}
