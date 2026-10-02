import { describe, expect, it } from "vitest";
import { fetchWithRetry } from "./retry";

const noWait = async () => {};

describe("fetchWithRetry", () => {
  it("retries when the model is overloaded and returns the later success", async () => {
    const statuses = [503, 503, 200];
    let calls = 0;
    const fetchImpl: typeof fetch = async () => new Response("{}", { status: statuses[calls++] });
    const response = await fetchWithRetry(fetchImpl, "https://example.test", () => ({}), noWait);
    expect(calls).toBe(3);
    expect(response.status).toBe(200);
  });

  it("stops after the last retry and returns the error response", async () => {
    let calls = 0;
    const fetchImpl: typeof fetch = async () => {
      calls += 1;
      return new Response("{}", { status: 503 });
    };
    const response = await fetchWithRetry(fetchImpl, "https://example.test", () => ({}), noWait);
    expect(calls).toBe(3);
    expect(response.status).toBe(503);
  });

  it("does not retry an invalid key", async () => {
    let calls = 0;
    const fetchImpl: typeof fetch = async () => {
      calls += 1;
      return new Response("{}", { status: 400 });
    };
    await fetchWithRetry(fetchImpl, "https://example.test", () => ({}), noWait);
    expect(calls).toBe(1);
  });
});
