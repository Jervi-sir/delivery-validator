export function getEcotrackBaseUrl(target: string): string {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  const lower = target.toLowerCase();
  if (lower === "dhd") {
    return "https://platform.dhd-dz.com";
  }
  if (lower === "omexpress" || lower === "om-express" || lower === "om") {
    return "https://omexpress.ecotrack.dz";
  }
  return `https://${target}.ecotrack.dz`;
}

export async function validateEcotrack(
  target: string,
  apiToken: string,
): Promise<boolean> {
  const baseUrl = getEcotrackBaseUrl(target);
  const url = `${baseUrl}/api/v1/validate/token?api_token=${apiToken}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok) return false;
  const data = await response.json().catch(() => ({}));
  return data?.success === true;
}
