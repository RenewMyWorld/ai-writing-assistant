import React, { useState, useEffect } from 'react';
import { BookOpen, Save } from 'lucide-react';
import { StoryStorage } from '../services/storyStorage';
import type { Project, Page } from '../types';

const genres = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Adventure',
  'Horror',
  'Literary Fiction',
  'Historical Fiction',
];

const lengths = ['Short story', 'Chapter', 'Novel'];

interface ProjectFormProps {
  initialProject?: Project | null;
  onSave: (project: Project) => void;
}

export default function ProjectForm({ initialProject, onSave }: ProjectFormProps) {
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    authorName: '',
    genre: genres[0],
    length: 'Chapter',
    pages: [{
      id: crypto.randomUUID(),
      number: 1,
      content: '',
      lastModified: new Date()
    }],
  });

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
    }
  }, [initialProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      ...project,
      id: project.id || crypto.randomUUID(),
      characters: project.characters || [],
      setting: project.setting || { location: '', description: '' },
      prompt: project.prompt || '',
      lastModified: new Date(),
      pages: project.pages || [{
        id: crypto.randomUUID(),
        number: 1,
        content: '',
        lastModified: new Date()
      }],
    } as Project;

    StoryStorage.saveStory(newProject);
    onSave(newProject);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Project Details</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your book title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author Name</label>
            <input
              type="text"
              value={project.authorName}
              onChange={(e) => setProject({ ...project, authorName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              value={project.genre}
              onChange={(e) => setProject({ ...project, genre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Length</label>
            <select
              value={project.length}
              onChange={(e) => setProject({ ...project, length: e.target.value as Project['length'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              {lengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Project
        </button>
      </div>
    </form>
  );
}