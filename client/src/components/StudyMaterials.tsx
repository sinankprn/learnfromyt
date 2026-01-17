import { useState } from "react";
import type { CourseData, LearningObjective, TranscriptData } from "../types/learningMaterial";

interface StudyMaterialsProps {
  url: string;
  data: CourseData | null;
  isLoading: boolean;
  error: string | null;
  onFetchStudyMaterials: () => void;
  transcriptData: TranscriptData | null;
  transcriptLoading: boolean;
}

export default function StudyMaterials({
  url,
  data,
  isLoading,
  error,
  onFetchStudyMaterials,
  transcriptData,
  transcriptLoading
}: StudyMaterialsProps) {

  // No URL
  if (!url) {
    return (
      <EmptyState
        icon="📺"
        title="No Video Loaded"
        subtitle="Load a video in the 'Watch & Learn' tab first"
      />
    );
  }

  // Loading (either transcript or study materials)
  if (isLoading || transcriptLoading) {
    const loadingMessage = transcriptLoading
      ? { title: "Generating Transcript First...", subtitle: "Transcribing video before creating study materials" }
      : { title: "Creating Study Materials...", subtitle: "Analyzing video and building educational content" };

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 border-4 border-[var(--color-bg-hover)] border-t-[var(--color-accent)] rounded-full animate-spin mb-6" />
        <h3 className="text-xl font-display font-semibold text-[var(--color-text-primary)] mb-2">{loadingMessage.title}</h3>
        <p className="text-[var(--color-text-muted)] max-w-sm">{loadingMessage.subtitle}</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Something went wrong"
        subtitle={error}
        action={{ label: "Try Again", onClick: onFetchStudyMaterials }}
      />
    );
  }

  // No data yet
  if (!data) {
    return (
      <EmptyState
        icon="🎓"
        title="Ready to Create Study Materials?"
        subtitle="Generate comprehensive learning materials with objectives, detailed sections, and a quiz."
        action={{
          label: "Generate Study Materials",
          onClick: onFetchStudyMaterials,
          primary: true,
        }}
      />
    );
  }

  // Show study materials
  return (
    <div className="flex flex-col gap-8">
      {/* Course Header */}
      <header className="p-8 bg-linear-to-br from-[var(--color-bg-surface)] to-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] relative">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-green-500/10 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[0.75rem] font-semibold text-green-400 uppercase tracking-wider">AI Study Materials</span>
        </div>
        <h1 className="m-0 font-display text-3xl font-semibold text-[var(--color-text-primary)] leading-tight">{data.title}</h1>
        <p className="mt-2 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">{data.description}</p>
        <button
          onClick={onFetchStudyMaterials}
          className="absolute top-6 right-6 px-4 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[0.8125rem] text-[var(--color-text-secondary)] cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          Regenerate
        </button>
      </header>

      {/* Transcript Summary */}
      {data.transcriptSummary && (
        <section className="p-8 bg-[var(--color-accent)]/5 border-l-4 border-[var(--color-accent)] rounded-r-2xl">
          <h3 className="text-[0.75rem] font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">Video Summary</h3>
          <p className="text-[var(--color-text-primary)] text-sm leading-relaxed italic">
            "{data.transcriptSummary}"
          </p>
        </section>
      )}

      {/* Prerequisites */}
      {data.prerequisites && data.prerequisites.length > 0 && (
        <section className="p-8 bg-purple-500/5 border-l-4 border-purple-400 rounded-r-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📚</span>
            <h3 className="text-[0.75rem] font-semibold text-purple-400 uppercase tracking-wider">Prerequisites</h3>
          </div>
          <p className="text-[var(--color-text-muted)] text-sm mb-3">Before diving in, you should be familiar with:</p>
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {data.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-primary)]">
                <span className="text-purple-400 font-bold">•</span>
                {prereq}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Learning Objectives */}
      {data.learningObjectives && data.learningObjectives.length > 0 && (
        <ObjectivesSection objectives={data.learningObjectives} />
      )}

      {/* Sections */}
      {data.sections && data.sections.length > 0 && (
        <SectionsDisplay
          sections={data.sections}
          objectives={data.learningObjectives || []}
        />
      )}

      {/* Key Takeaways */}
      {data.keyTakeaways && data.keyTakeaways.length > 0 && (
        <section className="p-8 bg-linear-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-400/50 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎓</span>
            <h2 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)]">Key Takeaways</h2>
          </div>
          <p className="mb-6 text-[var(--color-text-muted)] text-sm">The most important concepts to remember from this video:</p>
          <div className="flex flex-col gap-4">
            {data.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-[var(--color-bg-elevated)] rounded-xl border-l-4 border-yellow-400 shadow-sm">
                <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>
                <p className="m-0 text-[0.9375rem] text-[var(--color-text-primary)] leading-relaxed pt-0.5">{takeaway}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quiz */}
      {data.quiz && data.quiz.length > 0 && <QuizSection quiz={data.quiz} />}
    </div>
  );
}

// === SUB-COMPONENTS ===

function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: string;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void; primary?: boolean };
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl text-center shadow-lg">
      <span className="text-5xl mb-6 drop-shadow-md">{icon}</span>
      <h2 className="text-2xl font-display font-semibold text-[var(--color-text-primary)] mb-2">{title}</h2>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm">{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${action.primary
            ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:scale-105 shadow-[0_0_20px_var(--color-accent-glow)]"
            : "bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated)]"
            }`}
        >
          {action.primary && <span>✨</span>}
          {action.label}
        </button>
      )}
    </div>
  );
}

function ObjectivesSection({ objectives }: { objectives: LearningObjective[] }) {
  return (
    <section className="p-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎯</span>
        <h2 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)]">Learning Objectives</h2>
      </div>
      <p className="mb-6 text-[var(--color-text-muted)] text-[0.9375rem]">By the end of this study session, you will be able to:</p>
      <div className="flex flex-col gap-4">
        {objectives.map((obj) => (
          <div key={obj.id} className="flex items-start gap-4 p-4 bg-[var(--color-bg-elevated)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all">
            <div className="shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-[var(--color-accent)] to-[#c94a3d] flex items-center justify-center text-[0.75rem] font-bold text-white shadow-sm">
              {obj.id}
            </div>
            <p className="m-0 text-[0.9375rem] text-[var(--color-text-primary)] leading-relaxed pt-0.5">{obj.objective}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionsDisplay({
  sections,
  objectives,
}: {
  sections: CourseData["sections"];
  objectives: LearningObjective[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const getObjectiveText = (id: number) => {
    const obj = objectives.find((o) => o.id === id);
    return obj?.objective || "";
  };

  return (
    <section className="p-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📖</span>
        <h2 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)]">Study Content</h2>
      </div>
      <div className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-[var(--color-bg-elevated)] rounded-xl border border-[var(--color-border)] overflow-hidden transition-all">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
              className="w-full p-6 bg-transparent border-none cursor-pointer flex items-center justify-between text-left hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[0.875rem] font-bold transition-all duration-300 ${expandedIndex === index
                    ? "bg-linear-to-br from-[var(--color-accent)] to-[#c94a3d] text-white shadow-lg"
                    : "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)]"
                    }`}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="m-0 font-display text-lg font-semibold text-[var(--color-text-primary)]">{section.title}</h3>
                  <span className="text-[0.75rem] text-[var(--color-text-muted)]">
                    Objective {section.objectiveId} • {section.subsections.length} subsection{section.subsections.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <span
                className={`text-[0.75rem] text-[var(--color-text-muted)] transition-transform duration-300 ${expandedIndex === index ? "rotate-180" : "rotate-0"
                  }`}
              >
                ▼
              </span>
            </button>

            {expandedIndex === index && (
              <div className="px-6 pb-6 pt-2 border-t border-[var(--color-border)] animate-fadeIn">
                {/* Linked Objective */}
                <div className="p-4 bg-[var(--color-warm-soft)] rounded-lg mb-6 border-l-4 border-[var(--color-warm)]">
                  <span className="text-[0.6875rem] font-semibold text-[var(--color-warm)] uppercase tracking-wider">Learning Goal:</span>
                  <span className="block text-[0.875rem] text-[var(--color-text-primary)] mt-1 font-medium">
                    {getObjectiveText(section.objectiveId)}
                  </span>
                </div>

                {/* Technical Terms Glossary */}
                {section.technicalTerms && section.technicalTerms.length > 0 && (
                  <div className="mb-6 p-5 bg-indigo-500/5 border border-indigo-400/30 rounded-xl">
                    <h4 className="mb-4 text-[0.875rem] font-semibold text-indigo-400 flex items-center gap-2">
                      <span>📘</span> Technical Terms
                    </h4>
                    <div className="flex flex-col gap-3">
                      {section.technicalTerms.map((term, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="font-semibold text-[0.875rem] text-[var(--color-text-primary)]">{term.term}</span>
                          <span className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-relaxed">{term.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="mb-6 flex flex-col gap-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="flex flex-col gap-4">
                        {section.subsections.length > 1 && (
                          <h4 className="m-0 font-display text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                            <span className="text-[var(--color-accent)]">{subIndex + 1}.</span>
                            {subsection.heading}
                          </h4>
                        )}
                        <div className="pl-4">
                          <p className="m-0 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                            {subsection.content}
                          </p>

                          {/* Subsection Examples */}
                          {subsection.examples && subsection.examples.length > 0 && (
                            <div className="mt-4 flex flex-col gap-3">
                              {subsection.examples.map((example, exIndex) => (
                                <div key={exIndex} className="p-4 bg-blue-500/10 rounded-xl border-l-4 border-blue-400">
                                  <h5 className="mb-1 text-[0.875rem] font-semibold text-blue-400 flex items-center gap-1">
                                    💡 Example {subsection.examples!.length > 1 ? `${exIndex + 1}` : ''}
                                  </h5>
                                  <p className="m-0 text-[0.875rem] text-[var(--color-text-primary)] leading-relaxed">{example}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Points */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div className="mb-6 p-5 bg-green-500/5 border border-green-400/30 rounded-xl">
                    <h4 className="mb-3 text-[0.875rem] font-semibold text-green-400 flex items-center gap-2">
                      <span>✓</span> Key Points
                    </h4>
                    <ul className="m-0 p-0 list-none flex flex-col gap-2">
                      {section.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-[0.875rem] text-[var(--color-text-primary)]">
                          <span className="text-green-400 font-bold shrink-0">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Misconceptions */}
                {section.commonMisconceptions && section.commonMisconceptions.length > 0 && (
                  <div className="mb-6 p-5 bg-amber-500/5 border border-amber-400/30 rounded-xl">
                    <h4 className="mb-3 text-[0.875rem] font-semibold text-amber-400 flex items-center gap-2">
                      <span>⚠️</span> Common Misconceptions
                    </h4>
                    <ul className="m-0 p-0 list-none flex flex-col gap-3">
                      {section.commonMisconceptions.map((misconception, i) => (
                        <li key={i} className="flex items-start gap-3 text-[0.875rem] text-[var(--color-text-primary)] leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0">×</span>
                          {misconception}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Applications */}
                {section.practicalApplications && section.practicalApplications.length > 0 && (
                  <div className="p-5 bg-cyan-500/5 border border-cyan-400/30 rounded-xl">
                    <h4 className="mb-3 text-[0.875rem] font-semibold text-cyan-400 flex items-center gap-2">
                      <span>🔧</span> Practical Applications
                    </h4>
                    <ul className="m-0 p-0 list-none flex flex-col gap-2">
                      {section.practicalApplications.map((application, i) => (
                        <li key={i} className="flex items-start gap-3 text-[0.875rem] text-[var(--color-text-primary)]">
                          <span className="text-cyan-400 font-bold shrink-0">→</span>
                          {application}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function QuizSection({ quiz }: { quiz: CourseData["quiz"] }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Safety check
  if (!quiz || quiz.length === 0 || currentQuestion < 0 || currentQuestion >= quiz.length) {
    return null;
  }

  const question = quiz[currentQuestion];
  if (!question || !Array.isArray(question.options)) {
    return null;
  }

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <section className="p-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm mb-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">❓</span>
        <h2 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)]">Knowledge Check</h2>
      </div>

      {quizComplete ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-bg-elevated)] rounded-2xl text-center border border-[var(--color-border)]">
          <div className="w-32 h-32 rounded-full border-8 border-[var(--color-bg-surface)] flex flex-col items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-[var(--color-accent)] to-[var(--color-warm)] opacity-10" />
            <span className="text-4xl font-bold text-[var(--color-text-primary)]">{score}</span>
            <span className="text-sm text-[var(--color-text-muted)] font-medium">/ {quiz.length}</span>
          </div>
          <h3 className="text-2xl font-display font-semibold text-[var(--color-text-primary)] mb-2">
            {score === quiz.length
              ? "Perfect Score!"
              : score >= quiz.length / 2
                ? "Good Job!"
                : "Keep Practicing!"}
          </h3>
          <p className="text-[var(--color-text-secondary)] mb-8">
            You answered {score} out of {quiz.length} questions correctly.
          </p>
          <button
            onClick={resetQuiz}
            className="px-8 py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold hover:bg-[var(--color-accent-hover)] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--color-accent-glow)]"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Progress */}
          <div className="mb-2">
            <span className="text-[0.8125rem] text-[var(--color-text-muted)] mb-3 block font-medium">
              Question {currentQuestion + 1} of {quiz.length}
            </span>
            <div className="h-1.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[var(--color-accent)] to-[var(--color-warm)] transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h3 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)] leading-relaxed">{question?.question}</h3>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question?.options?.map((option, index) => {
              let classes = "flex items-center gap-4 p-5 bg-[var(--color-bg-elevated)] border-2 border-[var(--color-border)] rounded-xl cursor-pointer text-left transition-all duration-200";

              if (showResult) {
                if (index === question.correctIndex) {
                  classes = "flex items-center gap-4 p-5 bg-green-500/10 border-2 border-green-500 rounded-xl cursor-pointer text-left transition-all duration-200";
                } else if (index === selectedAnswer) {
                  classes = "flex items-center gap-4 p-5 bg-red-500/10 border-2 border-red-500 rounded-xl cursor-pointer text-left transition-all duration-200";
                }
              } else if (index === selectedAnswer) {
                classes = "flex items-center gap-4 p-5 bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] rounded-xl cursor-pointer text-left transition-all duration-200";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={classes}
                  disabled={showResult}
                >
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.875rem] ${showResult && index === question.correctIndex ? "bg-green-500 text-white" :
                    showResult && index === selectedAnswer ? "bg-red-500 text-white" :
                      index === selectedAnswer ? "bg-[var(--color-accent)] text-white" :
                        "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                    }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={`text-[0.9375rem] font-medium ${index === selectedAnswer || (showResult && index === question.correctIndex)
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                    }`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div
              className={`p-6 rounded-xl border-t-4 animate-fadeIn ${selectedAnswer === question.correctIndex
                ? "bg-green-500/5 border-green-400"
                : "bg-red-500/5 border-red-400"
                }`}
            >
              <p className={`font-bold text-[0.9375rem] mb-2 ${selectedAnswer === question.correctIndex ? "text-green-400" : "text-red-400"
                }`}>
                {selectedAnswer === question.correctIndex ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="m-0 text-[0.875rem] text-[var(--color-text-secondary)] leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <button
              onClick={nextQuestion}
              className="mt-4 px-8 py-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] rounded-xl font-semibold hover:bg-[var(--color-bg-hover)] transition-all flex items-center justify-center gap-2 hover:translate-x-1"
            >
              {currentQuestion < quiz.length - 1 ? "Next Question →" : "See Results"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
