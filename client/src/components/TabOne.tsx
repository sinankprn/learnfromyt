import Form from "./Form";
import YouTubePlayer from "./YouTubePlayer";

interface TabOneProps {
  url: string;
  onUrlChange: (url: string) => void;
}

export default function TabOne({ url, onUrlChange }: TabOneProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Form Section */}
      <section className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-8 py-6 border-b border-[var(--color-border)]">
          <h2 className="m-0 font-display text-xl font-semibold text-[var(--color-text-primary)]">
            Enter Video URL
          </h2>
          <p className="mt-1 text-[0.875rem] text-[var(--color-text-muted)]">
            Paste a YouTube link to start learning
          </p>
        </div>
        <Form onSubmitUrl={onUrlChange} />
      </section>

      {/* Video Player Section */}
      {url && (
        <section className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent-glow)] animate-pulse" />
            <span className="text-[0.875rem] text-[var(--color-text-secondary)] font-medium">
              Now Playing
            </span>
          </div>
          <YouTubePlayer url={url} />
        </section>
      )}

      {/* Empty State */}
      {!url && (
        <div className="flex flex-col items-center justify-center py-24 px-8 bg-[var(--color-bg-surface)] rounded-2xl border border-dashed border-[var(--color-border-strong)]">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-40"
            >
              <path
                d="M8 5.14v14l11-7-11-7z"
                fill="var(--color-text-muted)"
              />
            </svg>
          </div>
          <p className="m-0 font-display text-lg text-[var(--color-text-secondary)] italic">
            No video selected yet
          </p>
          <p className="mt-2 text-[0.875rem] text-[var(--color-text-muted)]">
            Enter a YouTube URL above to begin
          </p>
        </div>
      )}
    </div>
  );
}
