import { useState } from "react";

export default function Form({
  onSubmitUrl,
}: {
  onSubmitUrl: (url: string) => void;
}) {
  const [inputUrl, setInputUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inputUrl.trim()) {
      onSubmitUrl(inputUrl);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "var(--space-xl)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "var(--space-md)",
          alignItems: "stretch",
        }}
      >
        {/* Input wrapper with glow effect */}
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          {/* Glow effect behind input */}
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "var(--radius-md)",
              background: isFocused
                ? "linear-gradient(135deg, var(--color-accent) 0%, var(--color-warm) 100%)"
                : "transparent",
              opacity: isFocused ? 0.3 : 0,
              transition: "opacity var(--transition-smooth)",
              filter: "blur(8px)",
            }}
          />

          <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: "100%",
              padding: "var(--space-md) var(--space-lg)",
              fontSize: "0.9375rem",
              fontFamily: "var(--font-body)",
              background: "var(--color-bg-elevated)",
              border: `1px solid ${isFocused ? "var(--color-accent)" : "var(--color-border-strong)"}`,
              borderRadius: "var(--radius-md)",
              color: "var(--color-text-primary)",
              outline: "none",
              transition: "all var(--transition-smooth)",
              position: "relative",
            }}
          />

          {/* YouTube icon inside input */}
          <div
            style={{
              position: "absolute",
              right: "var(--space-md)",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: inputUrl ? 0 : 0.4,
              transition: "opacity var(--transition-fast)",
              pointerEvents: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                fill="var(--color-text-muted)"
              />
            </svg>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          style={{
            padding: "var(--space-md) var(--space-xl)",
            background: "linear-gradient(135deg, var(--color-accent) 0%, #c94a3d 100%)",
            border: "none",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: "0.9375rem",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all var(--transition-smooth)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            boxShadow: "0 4px 12px rgba(232, 93, 76, 0.3)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(232, 93, 76, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(232, 93, 76, 0.3)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 5.14v14l11-7-11-7z"
              fill="currentColor"
            />
          </svg>
          Load Video
        </button>
      </div>

      {/* Helper text */}
      <p
        style={{
          margin: "var(--space-md) 0 0",
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
        }}
      >
        Supports youtube.com and youtu.be links
      </p>
    </form>
  );
}
