import type { TranscriptData, TranscriptSegment } from "../types/learningMaterial";

interface LearningMaterialProps {
  url: string;
  data: TranscriptData | null;
  isLoading: boolean;
  error: string | null;
  onFetchTranscript: () => void;
}

export default function LearningMaterial({ url, data, isLoading, error, onFetchTranscript }: LearningMaterialProps) {

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

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 border-4 border-[var(--color-bg-hover)] border-t-[var(--color-accent)] rounded-full animate-spin mb-6" />
        <h3 className="text-xl font-display font-semibold text-[var(--color-text-primary)] mb-2">Transcribing Video...</h3>
        <p className="text-[var(--color-text-muted)] max-w-sm">Processing audio and generating transcript</p>
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
        action={{ label: "Try Again", onClick: onFetchTranscript }}
      />
    );
  }

  // No data yet
  if (!data) {
    return (
      <EmptyState
        icon="📝"
        title="Ready to Transcribe?"
        subtitle="Generate a full transcript of the video with timestamps and speaker identification."
        action={{
          label: "Generate Transcript",
          onClick: onFetchTranscript,
          primary: true,
        }}
      />
    );
  }

  // Show transcript
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="p-8 bg-linear-to-br from-[var(--color-bg-surface)] to-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] relative">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-green-500/10 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[0.75rem] font-semibold text-green-400 uppercase tracking-wider">AI Transcript</span>
        </div>
        <h1 className="m-0 font-display text-3xl font-semibold text-[var(--color-text-primary)] leading-tight">Video Transcript</h1>
        <p className="mt-2 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          {data.segments.length} segments transcribed
        </p>
        <button
          onClick={onFetchTranscript}
          className="absolute top-6 right-6 px-4 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[0.8125rem] text-[var(--color-text-secondary)] cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          Regenerate
        </button>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="p-8 bg-[var(--color-accent)]/5 border-l-4 border-[var(--color-accent)] rounded-r-2xl">
          <h3 className="text-[0.75rem] font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">Summary</h3>
          <p className="text-[var(--color-text-primary)] text-sm leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {/* Transcript Segments */}
      <section className="p-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📜</span>
          <h2 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)]">Transcript</h2>
        </div>
        <div className="flex flex-col gap-4">
          {data.segments.map((segment, index) => (
            <TranscriptSegmentCard key={index} segment={segment} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TranscriptSegmentCard({ segment }: { segment: TranscriptSegment }) {
  return (
    <div className="p-4 bg-[var(--color-bg-elevated)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-2 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[0.75rem] font-mono font-semibold rounded">
          {segment.timestamp}
        </span>
        <span className="text-[0.875rem] font-semibold text-[var(--color-text-primary)]">
          {segment.speaker}
        </span>
        <span className="text-[0.75rem] text-[var(--color-text-muted)]">
          {segment.language}
        </span>
      </div>
      <p className="m-0 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed">
        {segment.text}
      </p>
    </div>
  );
}

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
