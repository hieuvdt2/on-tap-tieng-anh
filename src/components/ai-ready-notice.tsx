"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function AIReadyNotice() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  function stay() {
    setOpen(false);
    router.replace("/");
  }

  return (
    <ConfirmDialog
      open={open}
      title="Đã cấu hình thành công"
      description="AI đã sẵn sàng. Bạn có thể tạo đề ngay."
      confirmLabel="Tạo đề AI"
      cancelLabel="Ở lại trang chủ"
      onConfirm={() => router.push("/ai-generator")}
      onCancel={stay}
    />
  );
}
