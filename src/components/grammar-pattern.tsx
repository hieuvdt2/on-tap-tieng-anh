"use client";

import { useState } from "react";
import { LessonLines } from "@/components/lesson-lines";
import { patternHasVerbS, tokenizePattern, type GrammarRole, type GrammarTerm } from "@/lib/grammar-pattern";

const roleClass: Record<GrammarRole, string> = {
  subject: "text-role-subject",
  verb: "text-role-verb",
  helper: "text-role-helper",
  negation: "text-role-negation",
};

function PatternLine({
  label,
  pattern,
  activeKey,
  onShow,
}: {
  label: string;
  pattern: string;
  activeKey: string | null;
  onShow: (term: GrammarTerm) => void;
}) {
  const pieces = tokenizePattern(pattern);

  return (
    <li className="grid gap-1 rounded-lg bg-background px-3 py-2 sm:grid-cols-[7.5rem_1fr] sm:items-baseline">
      <span className="text-xs font-medium tracking-[0.12em] text-muted uppercase">{label}</span>
      <p className="font-serif text-lg leading-8">
        {pieces.map((piece, index) =>
          piece.term ? (
            <button
              key={`${piece.text}-${index}`}
              type="button"
              className={`${roleClass[piece.term.role]} cursor-help border-b border-dotted font-semibold ${
                activeKey === piece.term.key ? "border-current" : "border-transparent"
              }`}
              onMouseEnter={() => onShow(piece.term!)}
              onFocus={() => onShow(piece.term!)}
            >
              {piece.text}
            </button>
          ) : (
            <span key={`${piece.text}-${index}`}>{piece.text}</span>
          ),
        )}
      </p>
    </li>
  );
}

export function GrammarPatterns({
  affirmative,
  negative,
  question,
}: {
  affirmative: string;
  negative: string;
  question: string;
}) {
  const [active, setActive] = useState<GrammarTerm | null>(null);
  const showVerbS = patternHasVerbS([affirmative, negative, question]);

  return (
    <div className="mt-3 grid gap-3">
      <ul className="grid gap-2">
        <PatternLine label="Khẳng định" pattern={affirmative} activeKey={active?.key ?? null} onShow={setActive} />
        <PatternLine label="Phủ định" pattern={negative} activeKey={active?.key ?? null} onShow={setActive} />
        <PatternLine label="Câu hỏi" pattern={question} activeKey={active?.key ?? null} onShow={setActive} />
      </ul>
      <div className="min-h-16 rounded-lg border border-line bg-card px-3 py-2 text-sm leading-6">
        {active ? (
          <>
            <p className={`font-medium ${roleClass[active.role]}`}>{active.name}</p>
            <p>{active.hint}</p>
          </>
        ) : (
          <p className="text-muted">Rê chuột hoặc bấm vào chữ màu để xem từ đó nghĩa là gì.</p>
        )}
      </div>
      {showVerbS ? (
        <div className="grid gap-2 rounded-lg border border-line bg-background px-3 py-3 text-sm leading-6">
          <p className="font-medium text-role-verb">Khi nào thêm -s, khi nào thêm -es</p>
          <p>Chỉ he, she, it ở câu khẳng định hiện tại đơn mới chia động từ. Các ngôi khác giữ nguyên V.</p>
          <LessonLines
            numbered
            text={[
              "-s: work thành works, play thành plays.",
              "-es: khi tận cùng s, x, z, ch, sh, o. watch thành watches, go thành goes.",
              "Phụ âm + y: đổi y thành i rồi thêm -es. study thành studies.",
              "Nguyên âm + y: vẫn thêm -s. play thành plays.",
            ].join("\n")}
          />
          <p>Trong câu phủ định và câu hỏi, does đã mang phần chia. Động từ chính trở lại dạng V.</p>
        </div>
      ) : null}
    </div>
  );
}
