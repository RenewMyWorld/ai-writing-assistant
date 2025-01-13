import { Project } from '../types';

export class StoryStorage {
  private static STORAGE_KEY = 'cerebo_stories';

  static saveStory(story: Project): void {
    const stories = this.getAllStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    
    if (existingIndex >= 0) {
      stories[existingIndex] = { ...story, lastModified: new Date() };
    } else {
      stories.push({ ...story, lastModified: new Date() });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  static getAllStories(): Project[] {
    const storiesJson = localStorage.getItem(this.STORAGE_KEY);
    if (!storiesJson) return [];
    
    const stories = JSON.parse(storiesJson);
    return stories.map((story: Project) => ({
      ...story,
      lastModified: new Date(story.lastModified)
    }));
  }

  static getStoryById(id: string): Project | null {
    const stories = this.getAllStories();
    const story = stories.find(s => s.id === id);
    return story || null;
  }

  static deleteStory(id: string): void {
    const stories = this.getAllStories();
    const filteredStories = stories.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredStories));
  }
}