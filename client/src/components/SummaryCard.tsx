interface SummaryCardProps {
  thesis: string;
  keyPoints: string[];
}

export default function SummaryCard({ thesis, keyPoints }: SummaryCardProps) {
  return (
    <div
      style={{
        background: "var(--color-bg-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      {/* Thesis Section */}
      <div
        style={{
          padding: "var(--space-xl)",
          borderBottom: "1px solid var(--color-border)",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: "linear-gradient(180deg, var(--color-accent) 0%, var(--color-warm) 100%)",
          }}
        />

        <div style={{ paddingLeft: "var(--space-md)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              marginBottom: "var(--space-md)",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>💡</span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-warm)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Main Thesis
            </span>
          </div>

          <blockquote
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "1.375rem",
              fontWeight: 500,
              fontStyle: "italic",
              color: "var(--color-text-primary)",
              lineHeight: 1.5,
            }}
          >
            "{thesis}"
          </blockquote>
        </div>
      </div>

      {/* Key Points Section */}
      <div style={{ padding: "var(--space-xl)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            marginBottom: "var(--space-lg)",
          }}
        >
          <span style={{ fontSize: "1rem" }}>🎯</span>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Key Takeaways
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          {keyPoints.map((point, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "var(--space-md)",
                alignItems: "flex-start",
                animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-bg-elevated)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-accent)",
                }}
              >
                {index + 1}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9375rem",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.6,
                  paddingTop: 2,
                }}
              >
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
