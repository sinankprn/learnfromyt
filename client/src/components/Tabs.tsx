import { useState } from "react";
import TabOne from "./TabOne";
import TabTwo from "./TabTwo";
import StudyMaterials from "./StudyMaterials";
import type { TranscriptData, CourseData } from "../types/learningMaterial";

const tabs = [
  { id: "tab1", label: "Watch & Learn", icon: "▶" },
  { id: "tab2", label: "Transcript", icon: "📜" },
  { id: "tab3", label: "Study Materials", icon: "📚" },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [url, setUrl] = useState("");

  // Lifted state - persists across tab changes
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [studyMaterialsData, setStudyMaterialsData] = useState<CourseData | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [studyMaterialsLoading, setStudyMaterialsLoading] = useState(false);
  const [studyMaterialsError, setStudyMaterialsError] = useState<string | null>(null);

  // Shared transcript fetch function
  const fetchTranscript = async () => {
    if (!url) return;

    setTranscriptLoading(true);
    setTranscriptError(null);

    try {
      const response = await fetch("http://localhost:3000/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to transcribe video");
      }

      const result: TranscriptData = await response.json();
      setTranscriptData(result);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setTranscriptError(errorMsg);
      throw err;
    } finally {
      setTranscriptLoading(false);
    }
  };

  // Shared study materials fetch function
  const fetchStudyMaterials = async () => {
    if (!url) return;

    // BUG FIX 2: Ensure transcript exists before generating study materials
    let currentTranscript = transcriptData;
    if (!currentTranscript) {
      try {
        currentTranscript = await fetchTranscript();
      } catch (err) {
        // If transcript generation fails, don't proceed
        return;
      }
    }

    setStudyMaterialsLoading(true);
    setStudyMaterialsError(null);

    try {
      const response = await fetch("http://localhost:3000/api/study-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate study materials");
      }

      const result: CourseData = await response.json();
      setStudyMaterialsData(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setStudyMaterialsError(errorMsg);
    } finally {
      setStudyMaterialsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-8 py-12 max-w-[1200px] mx-auto w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-[var(--color-bg-surface)] rounded-2xl mb-12 border border-[var(--color-border)] w-fit">
        {tabs.map((tab) => {
          const isDisabled = (tab.id === "tab2" || tab.id === "tab3") && !url;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              className={`
                relative px-6 py-4 rounded-xl font-medium flex items-center gap-2 transition-all duration-300
                ${isDisabled ? "cursor-not-allowed opacity-50 text-[var(--color-text-muted)]" : "cursor-pointer"}
                ${isActive
                  ? "bg-linear-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-hover)] text-[var(--color-text-primary)] shadow-lg"
                  : !isDisabled ? "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]" : ""
                }
              `}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[var(--color-accent)] rounded-full shadow-[0_0_8px_var(--color-accent-glow)] mb-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content - BUG FIX 1: Pass shared state down as props */}
      <div className="flex-1 animate-fadeIn">
        {activeTab === "tab1" && <TabOne url={url} onUrlChange={setUrl} />}
        {activeTab === "tab2" && (
          <TabTwo
            url={url}
            data={transcriptData}
            isLoading={transcriptLoading}
            error={transcriptError}
            onFetchTranscript={fetchTranscript}
          />
        )}
        {activeTab === "tab3" && (
          <StudyMaterials
            url={url}
            data={studyMaterialsData}
            isLoading={studyMaterialsLoading}
            error={studyMaterialsError}
            onFetchStudyMaterials={fetchStudyMaterials}
            transcriptData={transcriptData}
            transcriptLoading={transcriptLoading}
          />
        )}
      </div>
    </div>
  );
}
