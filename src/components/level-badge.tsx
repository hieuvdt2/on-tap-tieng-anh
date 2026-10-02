import { Badge } from "@/components/ui/badge";
import { levelLabel } from "@/lib/labels";
import type { MasteryLevel } from "@/modules/learning/mastery";

export function LevelBadge({ level }: { level: MasteryLevel | null }) {
  if (!level) return <Badge variant="neutral">Chưa học</Badge>;
  return <Badge variant={level}>{levelLabel[level]}</Badge>;
}
