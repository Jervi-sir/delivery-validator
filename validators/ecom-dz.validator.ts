export async function validateEcomdz(
  apiKey: string,
  apiToken: string,
): Promise<boolean> {
  const url = "https://ecom-dz.com/api_v2/test";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
      "X-API-Token": apiToken,
      accept: "application/json",
    },
  });
  return response.ok;
}
