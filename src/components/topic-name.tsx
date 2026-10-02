import { topicVietnameseName } from "@/lib/topic-names";

export function TopicName({ name }: { name: string }) {
  const vietnamese = topicVietnameseName(name);
  return (
    <>
      {name}
      {vietnamese ? <span className="font-sans text-[0.6em] font-normal text-muted"> ({vietnamese})</span> : null}
    </>
  );
}
