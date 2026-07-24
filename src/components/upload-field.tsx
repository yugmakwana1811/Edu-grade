"use client";

/* eslint-disable @next/next/no-img-element */
import { useId, useRef, useState } from "react";
import { Camera, GripVertical, X } from "lucide-react";

export function UploadField({
  onFilesChange,
  disabled = false,
}: {
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [items, setItems] = useState<Array<{ file: File; url: string }>>([]);
  function update(next: Array<{ file: File; url: string }>) {
    setItems(next);
    onFilesChange(next.map(({ file }) => file));
  }
  function remove(index: number) {
    URL.revokeObjectURL(items[index].url);
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    update(next);
    const transfer = new DataTransfer();
    next.forEach(({ file }) => transfer.items.add(file));
    if (inputRef.current) inputRef.current.files = transfer.files;
  }
  return (
    <div>
      <label
        htmlFor={inputId}
        aria-disabled={disabled}
        style={{
          display: "grid",
          placeItems: "center",
          padding: "1.5rem",
          border: "1.5px dashed var(--line-strong)",
          borderRadius: 14,
          cursor: disabled ? "wait" : "pointer",
          background: "var(--teal-soft)",
          textAlign: "center",
          opacity: disabled ? 0.65 : 1,
        }}
      >
        <Camera size={27} color="var(--teal)" />
        <strong style={{ marginTop: ".5rem" }}>
          Add handwritten answer pages
        </strong>
        <span className="hint">
          JPG, PNG, or WebP · up to 10 MB each · maximum 20 pages
        </span>
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        required
        disabled={disabled}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        onChange={(event) => {
          items.forEach(({ url }) => URL.revokeObjectURL(url));
          update(
            Array.from(event.target.files ?? []).map((file) => ({
              file,
              url: URL.createObjectURL(file),
            })),
          );
        }}
      />
      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(135px,1fr))",
            gap: ".75rem",
            marginTop: "1rem",
          }}
        >
          {items.map(({ file, url }, index) => (
            <div
              key={`${file.name}-${index}`}
              className="card"
              style={{ padding: ".5rem", position: "relative" }}
            >
              <img
                src={url}
                alt={`Preview of page ${index + 1}`}
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".3rem",
                  marginTop: ".4rem",
                }}
              >
                <GripVertical size={14} />
                <small
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Page {index + 1}
                </small>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove page ${index + 1}`}
                  onClick={() => remove(index)}
                  style={{
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--danger)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
