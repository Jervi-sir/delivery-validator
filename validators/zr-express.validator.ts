export async function validateZrExpress(
  tenant: string,
  apiKey: string,
): Promise<boolean> {
  const url = "https://api.zrexpress.app/api/v1/hubs/search";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "X-Tenant": tenant,
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  return response.ok;
}
