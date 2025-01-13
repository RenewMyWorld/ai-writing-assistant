import React from 'react';
import { Book, Calendar, Trash2, Edit2 } from 'lucide-react';
import { StoryStorage } from '../services/storyStorage';
import type { Project } from '../types';

interface SavedStoriesProps {
  onLoadStory: (story: Project) => void;
}

export default function SavedStories({ onLoadStory }: SavedStoriesProps) {
  const [stories, setStories] = React.useState<Project[]>([]);

  React.useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    const savedStories = StoryStorage.getAllStories();
    setStories(savedStories.sort((a, b) => 
      b.lastModified.getTime() - a.lastModified.getTime()
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      StoryStorage.deleteStory(id);
      loadStories();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <Book className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No stories</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new story.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Your Stories</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Continue working on your previous stories or start a new one.
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {stories.map((story) => (
          <li key={story.id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-indigo-600 truncate">
                    {story.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {story.genre} • {story.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {formatDate(story.lastModified)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoadStory(story)}
                      className="inline-flex items-center p-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="inline-flex items-center p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}