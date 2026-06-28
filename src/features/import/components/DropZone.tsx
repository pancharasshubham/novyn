"use client";

import { useId, useRef, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

/**
 * A presentational drag-and-drop / click-to-browse target. It knows nothing
 * about Instagram or validation — it just hands a File back to its parent.
 */
export function DropZone({ onFile, disabled = false }: DropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      onFile(file);
    }
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={[
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-8 py-16 text-center transition-colors",
        isDragging
          ? "border-accent bg-accent/5"
          : "border-edge bg-surface hover:border-muted",
        disabled ? "pointer-events-none opacity-60" : "",
      ].join(" ")}
    >
      <span className="text-base font-medium text-white">
        Drop your Instagram <span className="text-accent">saved_posts.json</span>
      </span>
      <span className="text-sm text-muted">
        or click to browse — nothing leaves your browser
      </span>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          // Allow re-selecting the same file after a reset.
          e.target.value = "";
        }}
      />
    </label>
  );
}
