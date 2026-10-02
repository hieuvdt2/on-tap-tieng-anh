import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ChangeModelLink({ error }: { error: string | null | undefined }) {
  if (!error?.includes("model khác")) return null;
  return (
    <Button asChild variant="outline">
      <Link href="/account/settings">Chọn model khác</Link>
    </Button>
  );
}
