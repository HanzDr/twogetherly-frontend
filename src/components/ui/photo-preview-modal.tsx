import { X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type PhotoPreviewModalProps = {
  isOpen: boolean;
  photoUrl: string;
  alt: string;
  onClose: () => void;
};

export function PhotoPreviewModal({ isOpen, photoUrl, alt, onClose }: PhotoPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-rose-950/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded contribution photo"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <img src={photoUrl} alt={alt} className="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl" />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute right-5 top-5 rounded-full bg-white text-rose-950 hover:bg-rose-50"
        onClick={onClose}
        aria-label="Close expanded photo"
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  );
}
