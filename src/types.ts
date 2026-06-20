export interface HistorySnippet {
  id: string;
  title: string;
  icon: string; // lucide icon name
  description: string;
  extendedDetails?: string;
  category: "tech" | "economy" | "community" | "milestone";
  stats?: { label: string; value: string };
}

export interface Volume {
  id: number;
  romanId: string;
  title: string;
  subtitle: string;
  snippets: HistorySnippet[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LimitedItem {
  id: string;
  name: string;
  color: string;
  basePrice: number;
  estimatedRobux: number;
  volatility: number;
  currentTrend: number[]; // Sparkline history
}
