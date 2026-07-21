export function getYalidineBaseUrl(target?: string): string {
  const lower = target?.toLowerCase();
  if (lower === "guepex") {
    return "https://api.guepex.app/v1";
  }
  return "https://api.yalidine.app/v1";
}

export async function validateYalidine(
  apiId: string,
  apiToken: string,
  target?: string,
): Promise<boolean> {
  const baseUrl = getYalidineBaseUrl(target);
  const url = `${baseUrl}/wilayas/`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-ID": apiId,
      "X-API-TOKEN": apiToken,
      accept: "application/json",
    },
  });
  console.log("response:", JSON.stringify(response, null, 2));
  return response.ok;
}
