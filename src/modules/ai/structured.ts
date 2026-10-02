import type { ZodType } from "zod";

export class StructuredOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StructuredOutputError";
  }
}

function readJson(raw: string): unknown {
  try {
    return JSON.parse(raw.trim());
  } catch {
    return null;
  }
}

export async function parseWithRepair<T>(input: {
  schema: ZodType<T>;
  prompt: string;
  request: (prompt: string) => Promise<string>;
}): Promise<T> {
  const first = await input.request(input.prompt);
  const checked = input.schema.safeParse(readJson(first));
  if (checked.success) return checked.data;

  const repairPrompt = `${input.prompt}\n\nBản JSON trước không hợp lệ: ${checked.error.message}\nChỉ trả về JSON đã sửa.\nBản cũ:\n${first}`;
  const second = await input.request(repairPrompt);
  const repaired = input.schema.safeParse(readJson(second));
  if (!repaired.success) throw new StructuredOutputError(repaired.error.message);
  return repaired.data;
}
