export default function NavigationBar({ title }: { title: string }) {
  return (
    <nav className="sticky top-0 z-[100] px-8 py-6 border-b border-[var(--color-border)] backdrop-blur-xl bg-[var(--color-bg-deep)]/95">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left: Logo & Branding */}
        <div className="flex items-center gap-4">
          {/* Logo with gradient background */}
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-br from-[var(--color-accent)] to-[#b8463a] rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-[var(--color-accent)] to-[#b8463a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="ml-0.5"
              >
                <path
                  d="M8 5.14v14l11-7-11-7z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="flex flex-col">
            <h1 className="m-0 font-display text-2xl font-bold tracking-tight bg-linear-to-r from-[var(--color-text-primary)] to-[var(--color-warm)] bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="m-0 text-[0.8125rem] text-[var(--color-text-muted)] font-medium">
              AI-Powered Video Learning Platform
            </p>
          </div>
        </div>

        {/* Right: Info Badge */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[var(--color-bg-surface)]/50 border border-[var(--color-border)] rounded-full backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="text-[0.8125rem] font-medium text-[var(--color-text-secondary)]">
              Powered by Gemini AI
            </span>
          </div>
          <div className="w-px h-4 bg-[var(--color-border)]" />
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-60"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="var(--color-warm)"
              />
            </svg>
            <span className="text-[0.75rem] font-semibold text-[var(--color-warm)]">
              Pro
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
