const options = [
  { value: "auto", label: "Tự động" },
  { value: "easy", label: "Dễ" },
  { value: "medium", label: "Vừa" },
  { value: "hard", label: "Khó" },
] as const;

// Radio không cần JS: gửi kèm form dưới tên "difficulty". Mặc định "Tự động" theo mức học.
export function DifficultyPicker({ idPrefix }: { idPrefix: string }) {
  return (
    <fieldset className="grid gap-1.5">
      <legend className="text-sm">Độ khó</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-10 cursor-pointer items-center rounded-lg border border-line bg-card px-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
          >
            <input
              type="radio"
              name="difficulty"
              value={option.value}
              defaultChecked={option.value === "auto"}
              className="sr-only"
              id={`${idPrefix}-${option.value}`}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
