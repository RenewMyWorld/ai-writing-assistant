export interface Project {
  id: string;
  title: string;
  authorName: string;
  genre: string;
  length: 'Short story' | 'Chapter' | 'Novel';
  prompt: string;
  characters: Character[];
  setting: Setting;
  lastModified: Date;
  pages: Page[];
}

export interface Page {
  id: string;
  number: number;
  content: string;
  title?: string;
  lastModified: Date;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  personalityTraits: string[];
}

export interface Setting {
  location: string;
  description: string;
}

export interface LLMConfig {
  model: string;
  directory: string;
}

export type ModelId = 'opt-6.7b' | 'bloom' | 'falcon-7b' | 'mpt-7b' | 'custom';