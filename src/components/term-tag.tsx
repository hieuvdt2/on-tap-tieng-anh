const tones = [
  "bg-accent/10 text-accent",
  "bg-role-verb/10 text-role-verb",
  "bg-role-helper/15 text-role-helper",
];

export function TermTag({ children, index = 0 }: { children: string; index?: number }) {
  return (
    <span className={`inline rounded-md px-1.5 py-0.5 font-serif font-semibold ${tones[index % tones.length]}`}>
      {children}
    </span>
  );
}
