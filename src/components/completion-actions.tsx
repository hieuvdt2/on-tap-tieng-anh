import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CompletionActions({
  continueHref,
  continueLabel,
}: {
  continueHref: string;
  continueLabel: string;
}) {
  return (
    <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
      <Button asChild className="w-full sm:w-auto">
        <Link href={continueHref}>{continueLabel}</Link>
      </Button>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href="/">Thôi, về tổng quan</Link>
      </Button>
    </div>
  );
}
