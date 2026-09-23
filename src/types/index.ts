export type TechCategory = 'frontend' | 'backend' | 'data' | 'ai' | 'engineering';

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
  tagline: string;
  description: string;
  usedFor: string[];
  exploring: string[];
  practicalInsight: string;
  tags: string[];
}

export interface ThoughtNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  keyQuestions: string[];
  decisionCriteria: string[];
}

export type ArchitectureNodeId = 'client' | 'api' | 'services' | 'cache' | 'database' | 'vector';

export interface ArchitectureComponent {
  id: ArchitectureNodeId;
  name: string;
  short: string;
  kind: string;
  responsibility: string;
  tradeoffs: string;
  keyPractices: string[];
  techUsed: string[];
}

export type LearningStage = 'Exploring' | 'Learning' | 'Building' | 'Applying';

export interface LearningArea {
  topic: string;
  stage: LearningStage;
  description: string;
  keyConcepts: string[];
}

export interface Principle {
  title: string;
  summary: string;
  quote: string;
  points: string[];
}

export interface TerminalCommand {
  command: string;
  description: string;
  output: string[];
}

/** 5-d toy embedding: [place, ai, math, frontend, backend]. */
export type Vector5 = [number, number, number, number, number];

export interface SimilarityItem {
  id: string;
  category: string;
  text: string;
  vector: Vector5;
}
