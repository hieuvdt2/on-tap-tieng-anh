"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isValidUsername } from "@/lib/auth-crypto";
import { loginUser, logoutUser, registerUser, safeNextPath } from "@/lib/auth";

const credentialsSchema = z.object({
  username: z.string().trim().min(3).max(32).refine(isValidUsername),
  password: z.string().min(8).max(128),
});

const registrationSchema = credentialsSchema.extend({
  displayName: z.string().trim().min(2).max(50),
});

export async function loginAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  const next = safeNextPath(formData.get("next")?.toString());
  if (!parsed.success || !(await loginUser(parsed.data.username, parsed.data.password))) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function registerAction(formData: FormData) {
  const parsed = registrationSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) redirect("/register?error=invalid");

  const result = await registerUser(parsed.data);
  if (!result.ok) redirect("/register?error=duplicate");
  redirect("/");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/login");
}
