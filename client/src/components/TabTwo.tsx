import LearningMaterial from "./LearningMaterial";
import type { TranscriptData } from "../types/learningMaterial";

interface TabTwoProps {
  url: string;
  data: TranscriptData | null;
  isLoading: boolean;
  error: string | null;
  onFetchTranscript: () => void;
}

export default function TabTwo({ url, data, isLoading, error, onFetchTranscript }: TabTwoProps) {
  return (
    <div className="animate-fadeIn">
      <LearningMaterial
        url={url}
        data={data}
        isLoading={isLoading}
        error={error}
        onFetchTranscript={onFetchTranscript}
      />
    </div>
  );
}
