export type Faq = {
  q: string;
  a: string;
  bullets?: string[];
};

export const FAQS: Faq[] = [
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
    a: "The validity period and the documentation. A 2-year certificate needs your latest year's ITR, while a 3-year certificate needs ITRs for the latest two years. Fees also differ: if Platizio arranges your Net Worth Certificate, the flat certificate fee is ₹5,000 for a 2-year or ₹7,000 for a 3-year certificate, with no GST. The SEBI accreditation fee is ₹2,000 + GST, and the NDML registration fee (₹10,000+GST for a 2-year or ₹14,500+GST for a 3-year certificate) is payable separately, later, at registration. If you already hold a Net Worth Certificate, you skip the certificate fee.",
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
