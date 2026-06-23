// TODO(launch): set the real production domain in .env (NEXT_PUBLIC_SITE_URL).
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://platizio.com").replace(/\/$/, ""),
  name: "Platizio",
  title: "Platizio — Become a SEBI Accredited Investor",
  description:
    "Become a SEBI Accredited Investor in India — Platizio arranges your Net Worth Certificate via affiliated CAs and submits your accreditation to NDML.",
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
