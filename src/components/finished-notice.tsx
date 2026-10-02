import Image from "next/image";

export function FinishedNotice() {
  return (
    <Image
      src="/assets/finished.png"
      alt="Tuyệt vời! Bạn làm xong rồi!"
      width={929}
      height={790}
      priority
      className="mx-auto h-auto w-full max-w-md"
    />
  );
}
