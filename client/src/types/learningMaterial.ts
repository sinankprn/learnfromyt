// Enhanced types for comprehensive, course-quality study materials
export interface CourseData {
  title: string;
  description: string;
  transcriptSummary?: string;
  prerequisites?: string[];
  learningObjectives: LearningObjective[];
  sections: Section[];
  keyTakeaways: string[];
  quiz: QuizQuestion[];
}

export interface TranscriptSegment {
  timestamp: string; // MM:SS
  speaker: string;
  text: string;
  language: string;
  language_code: string;
}

export interface TranscriptData {
  summary: string;
  segments: TranscriptSegment[];
}

export interface LearningObjective {
  id: number;
  objective: string;
}

export interface Subsection {
  heading: string;
  content: string;
  examples?: string[];
}

export interface TechnicalTerm {
  term: string;
  definition: string;
}

export interface Section {
  title: string;
  objectiveId: number;
  subsections: Subsection[];
  technicalTerms?: TechnicalTerm[];
  keyPoints: string[];
  commonMisconceptions?: string[];
  practicalApplications?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
