import { requireUser } from "./auth";

export async function getStudentId() {
  return (await requireUser()).id;
}
