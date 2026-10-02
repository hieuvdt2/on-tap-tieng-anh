import type { ZodType } from "zod";

export class StructuredOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StructuredOutputError";
  }
}

function readJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      return null;
    }
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
