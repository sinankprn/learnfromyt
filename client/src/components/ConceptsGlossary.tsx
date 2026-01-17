import { useState } from "react";
import type { Concept } from "../types/learningMaterial";

interface ConceptsGlossaryProps {
  concepts: Concept[];
}

export default function ConceptsGlossary({ concepts }: ConceptsGlossaryProps) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  if (concepts.length === 0) return null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-lg)",
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>📚</span>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          Key Concepts
        </h3>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
          }}
        >
          Click to reveal definitions
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-md)",
        }}
      >
        {concepts.map((concept, index) => (
          <div
            key={index}
            onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
            style={{
              perspective: "1000px",
              cursor: "pointer",
              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            <div
              style={{
                position: "relative",
                height: 140,
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                transformStyle: "preserve-3d",
                transform: flippedIndex === index ? "rotateY(180deg)" : "rotateY(0)",
              }}
            >
              {/* Front - Term */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  background: "var(--color-bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border)",
                  padding: "var(--space-lg)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-warm) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {concept.term.charAt(0).toUpperCase()}
                </div>
                <h4
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {concept.term}
                </h4>
                <span
                  style={{
                    marginTop: "var(--space-sm)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Tap to see definition
                </span>
              </div>

              {/* Back - Definition */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-accent)",
                  padding: "var(--space-lg)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--color-accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  {concept.term}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.6,
                  }}
                >
                  {concept.definition}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
