// Mock API key for testing
const TEST_API_KEY = 'test-key-123';

export interface LLMResponse {
  content: string;
  model: string;
}

export class LLMService {
  private static prompts = {
    fantasy: [
      "Describe a magical artifact that your protagonist discovers in an ancient temple.",
      "Write about your character's first experience using their newfound magical abilities.",
      "Detail the moment your hero realizes they're part of an ancient prophecy."
    ],
    'science fiction': [
      "Describe the first contact between humans and an alien civilization.",
      "Write about your character discovering a groundbreaking technology.",
      "Detail the moment your protagonist realizes the true nature of their space mission."
    ],
    mystery: [
      "Set the scene for the discovery of a crucial piece of evidence.",
      "Write the moment your detective realizes who the real culprit is.",
      "Describe the first suspicious incident that triggers your investigation."
    ]
  };

  static async getPrompt(genre: string): Promise<LLMResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const prompts = this.prompts[genre.toLowerCase()] || this.prompts.fantasy;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    return {
      content: randomPrompt,
      model: 'mock-llm-v1'
    };
  }

  static async generateSuggestion(content: string): Promise<LLMResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      content: "Consider expanding on the character's emotional state during this scene. What are they feeling? How does their body language reflect their internal struggle?",
      model: 'mock-llm-v1'
    };
  }
}