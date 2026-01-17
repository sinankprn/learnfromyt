import { useState } from "react";
import type { Section } from "../types/learningMaterial";

interface SectionListProps {
  sections: Section[];
}

export default function SectionList({ sections }: SectionListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-sm)",
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>📖</span>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          Content Breakdown
        </h3>
      </div>

      {sections.map((section, index) => (
        <SectionItem
          key={index}
          section={section}
          index={index}
          isExpanded={expandedIndex === index}
          onToggle={() => toggleSection(index)}
        />
      ))}
    </div>
  );
}

interface SectionItemProps {
  section: Section;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function SectionItem({ section, index, isExpanded, onToggle }: SectionItemProps) {
  return (
    <div
      style={{
        background: "var(--color-bg-surface)",
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${isExpanded ? "var(--color-border-strong)" : "var(--color-border)"}`,
        overflow: "hidden",
        transition: "all var(--transition-smooth)",
        animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "var(--space-lg)",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          textAlign: "left",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: isExpanded
              ? "linear-gradient(135deg, var(--color-accent) 0%, #c94a3d 100%)"
              : "var(--color-bg-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: isExpanded ? "var(--color-text-primary)" : "var(--color-text-muted)",
            transition: "all var(--transition-smooth)",
          }}
        >
          {index + 1}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "1.0625rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            {section.title}
          </h4>
          <p
            style={{
              margin: "var(--space-xs) 0 0",
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {section.keyIdea}
          </p>
        </div>

        {/* Expand/Collapse Icon */}
        <div
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform var(--transition-smooth)",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            padding: "0 var(--space-lg) var(--space-lg)",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Key Idea Highlight */}
          <div
            style={{
              padding: "var(--space-md)",
              background: "var(--color-warm-soft)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-lg)",
              borderLeft: "3px solid var(--color-warm)",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-warm)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Key Idea
            </span>
            <p
              style={{
                margin: "var(--space-xs) 0 0",
                fontSize: "0.9375rem",
                color: "var(--color-text-primary)",
                fontWeight: 500,
              }}
            >
              {section.keyIdea}
            </p>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: section.examples.length > 0 ? "var(--space-lg)" : 0 }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Explanation
            </span>
            <p
              style={{
                margin: "var(--space-sm) 0 0",
                fontSize: "0.9375rem",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              {section.explanation}
            </p>
          </div>

          {/* Examples */}
          {section.examples.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Examples
              </span>
              <ul
                style={{
                  margin: "var(--space-sm) 0 0",
                  paddingLeft: "var(--space-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-sm)",
                }}
              >
                {section.examples.map((example, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
