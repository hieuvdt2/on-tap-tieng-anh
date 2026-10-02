import { PendingLink } from "@/components/pending-link";
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
        <PendingLink href={continueHref} label="Đang mở…">{continueLabel}</PendingLink>
      </Button>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <PendingLink href="/" label="Đang về tổng quan…">Thôi, về tổng quan</PendingLink>
      </Button>
    </div>
  );
}
