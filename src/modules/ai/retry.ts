const retryableStatus = new Set([500, 502, 503, 504]);
const delaysMs = [2_000, 5_000];

export async function fetchWithRetry(
  fetchImpl: typeof fetch,
  url: string,
  init: () => RequestInit,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
) {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetchImpl(url, init());
    if (!retryableStatus.has(response.status) || attempt >= delaysMs.length) return response;
    await response.body?.cancel();
    await wait(delaysMs[attempt]);
  }
}
