export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // Scrub "<" to its unicode escape to prevent XSS via any future
      // dynamic JSON-LD field (per Next.js docs). Harmless for static data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
