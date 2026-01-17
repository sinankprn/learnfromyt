import { useState } from "react";
import type { Question } from "../types/learningMaterial";

interface QuizSectionProps {
  questions: Question[];
}

const questionTypeConfig = {
  recall: {
    label: "Recall",
    color: "#4ade80",
    bgColor: "rgba(74, 222, 128, 0.1)",
    icon: "🧠",
    description: "Test your memory",
  },
  conceptual: {
    label: "Conceptual",
    color: "#60a5fa",
    bgColor: "rgba(96, 165, 250, 0.1)",
    icon: "💭",
    description: "Understand the ideas",
  },
  applied: {
    label: "Applied",
    color: "#f472b6",
    bgColor: "rgba(244, 114, 182, 0.1)",
    icon: "⚡",
    description: "Put it into practice",
  },
};

export default function QuizSection({ questions }: QuizSectionProps) {
  const [activeType, setActiveType] = useState<"all" | Question["type"]>("all");
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const filteredQuestions = activeType === "all"
    ? questions
    : questions.filter((q) => q.type === activeType);

  const toggleAnswer = (index: number) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedAnswers(newRevealed);
  };

  const revealAll = () => {
    const allIndices = new Set(filteredQuestions.map((_, i) => i));
    setRevealedAnswers(allIndices);
  };

  const hideAll = () => {
    setRevealedAnswers(new Set());
  };

  if (questions.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-lg)",
          flexWrap: "wrap",
          gap: "var(--space-md)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <span style={{ fontSize: "1.25rem" }}>❓</span>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Review Questions
          </h3>
          <span
            style={{
              padding: "var(--space-xs) var(--space-sm)",
              background: "var(--color-bg-elevated)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
            }}
          >
            {filteredQuestions.length} questions
          </span>
        </div>

        {/* Reveal/Hide All */}
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button
            onClick={revealAll}
            style={{
              padding: "var(--space-sm) var(--space-md)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            Show All
          </button>
          <button
            onClick={hideAll}
            style={{
              padding: "var(--space-sm) var(--space-md)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-xl)",
          overflowX: "auto",
          paddingBottom: "var(--space-xs)",
        }}
      >
        <FilterTab
          label="All"
          count={questions.length}
          isActive={activeType === "all"}
          onClick={() => setActiveType("all")}
        />
        {(Object.keys(questionTypeConfig) as Question["type"][]).map((type) => {
          const config = questionTypeConfig[type];
          const count = questions.filter((q) => q.type === type).length;
          if (count === 0) return null;
          return (
            <FilterTab
              key={type}
              label={config.label}
              count={count}
              isActive={activeType === type}
              onClick={() => setActiveType(type)}
              color={config.color}
            />
          );
        })}
      </div>

      {/* Questions List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
        }}
      >
        {filteredQuestions.map((question, index) => {
          const config = questionTypeConfig[question.type];
          const isRevealed = revealedAnswers.has(index);

          return (
            <div
              key={index}
              style={{
                background: "var(--color-bg-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              {/* Question */}
              <div style={{ padding: "var(--space-lg)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <span
                    style={{
                      padding: "var(--space-xs) var(--space-sm)",
                      background: config.bgColor,
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: config.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>{config.icon}</span>
                    {config.label}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.6,
                  }}
                >
                  {question.question}
                </p>
              </div>

              {/* Answer Toggle */}
              <div
                style={{
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                {isRevealed ? (
                  <div
                    style={{
                      padding: "var(--space-lg)",
                      background: "var(--color-bg-elevated)",
                      animation: "fadeIn 0.2s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "var(--space-sm)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--color-accent)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Answer
                      </span>
                      <button
                        onClick={() => toggleAnswer(index)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Hide
                      </button>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9375rem",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                      }}
                    >
                      {question.answer}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleAnswer(index)}
                    style={{
                      width: "100%",
                      padding: "var(--space-md) var(--space-lg)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-sm)",
                      fontSize: "0.875rem",
                      color: "var(--color-text-muted)",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Reveal Answer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface FilterTabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

function FilterTab({ label, count, isActive, onClick, color }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "var(--space-sm) var(--space-md)",
        background: isActive ? "var(--color-bg-elevated)" : "transparent",
        border: `1px solid ${isActive ? "var(--color-border-strong)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-full)",
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: isActive ? (color || "var(--color-text-primary)") : "var(--color-text-muted)",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-sm)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <span
        style={{
          padding: "2px 6px",
          background: isActive ? "var(--color-bg-hover)" : "var(--color-bg-elevated)",
          borderRadius: "var(--radius-full)",
          fontSize: "0.6875rem",
        }}
      >
        {count}
      </span>
    </button>
  );
}
