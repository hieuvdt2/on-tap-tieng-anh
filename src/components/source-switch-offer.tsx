import { FormPending } from "@/components/form-pending";
import { Button } from "@/components/ui/button";
import { switchSourceAndContinue } from "@/modules/ai/generator-actions";

type Source = { choice: string; label: string; model: string };

// Khi tạo đề lỗi: hỏi người dùng có đồng ý chuyển sang nguồn AI khác đã lưu khoá để tạo tiếp không.
// `children` là các thao tác sẵn có (thử lại với nguồn hiện tại, vào Thiết lập AI).
export function SourceSwitchOffer({
  jobId,
  error,
  current,
  options,
  children,
}: {
  jobId: string;
  error: string;
  current: Source | null;
  options: Source[];
  children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-danger/30 bg-card p-3 sm:p-4">
      <div className="grid gap-1">
        <p className="font-medium text-danger">
          {current ? `${current.label} · ${current.model} đang gặp lỗi` : "Nguồn AI đang gặp lỗi"}
        </p>
        <p className="text-sm leading-6">{error}</p>
      </div>

      {options.length > 0 ? (
        <div className="grid gap-2">
          <p className="text-sm font-medium">Bạn có muốn chuyển sang nguồn AI đã lưu khác để tạo tiếp không?</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <form key={option.choice} action={switchSourceAndContinue}>
                <input type="hidden" name="jobId" value={jobId} />
                <input type="hidden" name="choice" value={option.choice} />
                <Button type="submit">
                  Chuyển sang {option.label} · {option.model}
                </Button>
                <FormPending label={`Đang chuyển sang ${option.label}…`} />
              </form>
            ))}
          </div>
          <p className="text-xs text-muted">
            Nguồn AI của tài khoản sẽ đổi theo lựa chọn này (đổi lại bất cứ lúc nào ở Thiết lập AI). Các câu đã tạo được giữ nguyên.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted">Bạn chưa lưu khoá của nguồn AI nào khác để chuyển sang. Có thể thêm ở Thiết lập AI.</p>
      )}

      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
