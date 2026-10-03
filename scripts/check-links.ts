/**
 * Checks every external link in site.ts (official visa sources, social profiles).
 * Some government sites refuse automated requests (403) or drop the connection;
 * those are reported as "check by hand" rather than as failures.
 */
import { destinations, social } from "../src/content/site";

const links = [
  ...destinations.map((d) => ({
    label: `${d.name}: ${d.officialSource.label}`,
    href: d.officialSource.href,
  })),
  ...social.map((s) => ({ label: s.label, href: s.href })),
];

let broken = 0;
for (const link of links) {
  let verdict: string;
  try {
    const response = await fetch(link.href, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (link check for tarleytravel.com)" },
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) verdict = "ok";
    else if (response.status === 403 || response.status === 429)
      verdict = `check by hand (${response.status})`;
    else {
      verdict = `BROKEN (${response.status})`;
      broken++;
    }
  } catch {
    verdict = "check by hand (no response)";
  }
  console.log(`${verdict.padEnd(28)} ${link.label}  ${link.href}`);
}
if (broken > 0) process.exit(1);
