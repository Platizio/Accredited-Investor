export const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbz4GDAAur1ItGhYTn1QI15qNtRcUfzLXqHxqKsO0mu5Sop-3yWZkpnb057uoNIEruwc/exec";

// TODO(launch): set the real production domain in .env (NEXT_PUBLIC_SITE_URL).
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://platizio.com").replace(/\/$/, ""),
  name: "Platizio",
  title: "Platizio — Become a SEBI Accredited Investor",
  description:
    "Platizio helps Indian investors obtain SEBI Accredited Investor status — Net Worth Certificate via affiliated CAs and accreditation submitted to NDML, end to end.",
  locale: "en_IN",
  twitter: "@platizio", // TODO(launch): set/remove if no handle
} as const;

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Australia", "Austria",
  "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt",
  "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece", "Hong Kong", "Hungary",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan",
  "Kenya", "Kuwait", "Lebanon", "Libya", "Malaysia", "Mexico", "Morocco", "Nepal",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore",
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tanzania", "Thailand", "Turkey", "UAE", "Uganda", "UK", "Ukraine",
  "USA", "Vietnam", "Yemen", "Zimbabwe",
];
