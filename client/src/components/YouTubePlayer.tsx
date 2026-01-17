function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Handle youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    // Handle youtube.com
    if (parsedUrl.hostname.includes("youtube.com")) {
      // watch?v=VIDEO_ID
      if (parsedUrl.searchParams.has("v")) {
        return parsedUrl.searchParams.get("v");
      }

      // /embed/VIDEO_ID or /shorts/VIDEO_ID
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function YouTubePlayer({ url }: { url: string }) {
  const videoId = getYouTubeVideoId(url);

  // Invalid URL state
  if (!videoId) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          background: "var(--color-bg-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-md)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--color-bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="var(--color-text-muted)"
                opacity="0.5"
              />
              <line
                x1="4"
                y1="4"
                x2="20"
                y2="20"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                color: "var(--color-text-secondary)",
              }}
            >
              Invalid YouTube URL
            </p>
            <p
              style={{
                margin: "var(--space-xs) 0 0",
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
              }}
            >
              Please check the link and try again
            </p>
          </div>
        </div>
      </div>
    );
  }

  const src = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--color-bg-deep)",
        boxShadow: "var(--shadow-soft), var(--shadow-glow)",
      }}
    >
      {/* Decorative frame */}
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-warm) 50%, var(--color-accent) 100%)",
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* Video container with 16:9 aspect ratio */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          zIndex: 1,
        }}
      >
        <iframe
          src={src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "var(--radius-lg)",
          }}
        />
      </div>

      {/* Bottom reflection effect */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: "10%",
          right: "10%",
          height: 40,
          background: "linear-gradient(180deg, var(--color-accent-glow) 0%, transparent 100%)",
          filter: "blur(20px)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
    </div>
  );
}
