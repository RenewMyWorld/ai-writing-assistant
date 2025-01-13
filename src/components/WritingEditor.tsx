import React, { useState, useEffect } from 'react';
import { MessageSquare, Lightbulb, Sparkles, Save, ChevronLeft, ChevronRight, Plus, Trash2, MoveVertical } from 'lucide-react';
import { LLMService } from '../services/llm';
import { StoryStorage } from '../services/storyStorage';
import MicrophoneInput from './MicrophoneInput';
import type { Project, Page } from '../types';

interface WritingEditorProps {
  project?: Project | null;
  onSave: (pages: Page[]) => void;
}

export default function WritingEditor({ project, onSave }: WritingEditorProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (project) {
      setPages(project.pages || [{
        id: crypto.randomUUID(),
        number: 1,
        content: '',
        lastModified: new Date()
      }]);
      loadPrompt(project.genre);
    }
  }, [project]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pages.length > 0 && project) {
        handleAutoSave();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pages]);

  const loadPrompt = async (genre: string) => {
    setIsLoading(true);
    try {
      const response = await LLMService.getPrompt(genre);
      setPrompt(response.content);
    } catch (error) {
      console.error('Failed to load prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSave = () => {
    onSave(pages);
    if (project) {
      StoryStorage.saveStory({
        ...project,
        pages,
        lastModified: new Date()
      });
      setAutoSaveStatus('Saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    }
  };

  const getCurrentPage = () => pages[currentPageIndex];

  const updateCurrentPage = (content: string) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = {
      ...getCurrentPage(),
      content,
      lastModified: new Date()
    };
    setPages(updatedPages);
  };

  const handleTranscript = (text: string) => {
    if (!getCurrentPage()) return;

    if (text === '__DELETE_LAST_SENTENCE__') {
      const content = getCurrentPage().content;
      const lastSentenceIndex = content.lastIndexOf('.');
      if (lastSentenceIndex > 0) {
        updateCurrentPage(content.substring(0, lastSentenceIndex + 1));
      }
    } else {
      const currentContent = getCurrentPage().content;
      const newContent = currentContent + (currentContent.endsWith(' ') ? '' : ' ') + text;
      updateCurrentPage(newContent);
    }
  };

  const getSuggestion = async () => {
    if (!getCurrentPage()?.content.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await LLMService.generateSuggestion(getCurrentPage()?.content || '');
      setSuggestion(response.content);
    } catch (error) {
      console.error('Failed to get suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewPage = () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      number: pages.length + 1,
      content: '',
      lastModified: new Date()
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const deletePage = () => {
    if (pages.length <= 1) return;
    const updatedPages = pages.filter((_, index) => index !== currentPageIndex);
    setPages(updatedPages);
    setCurrentPageIndex(Math.min(currentPageIndex, updatedPages.length - 1));
  };

  const movePage = (fromIndex: number, toIndex: number) => {
    const updatedPages = [...pages];
    const [movedPage] = updatedPages.splice(fromIndex, 1);
    updatedPages.splice(toIndex, 0, movedPage);
    setPages(updatedPages.map((page, index) => ({ ...page, number: index + 1 })));
    setCurrentPageIndex(toIndex);
  };

  return (
    <div className="space-y-4">
      {showPrompt && prompt && (
        <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <h3 className="font-medium text-indigo-900">Writing Prompt</h3>
            <p className="text-indigo-700 mt-1">{prompt}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-6 border-b border-amber-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-amber-900">
              {project?.title || 'New Story'}
            </h3>
            {autoSaveStatus && (
              <span className="text-sm text-green-600 flex items-center">
                <Save className="w-4 h-4 mr-1" />
                {autoSaveStatus}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="p-8 min-h-[600px] bg-gradient-to-b from-amber-50/50">
            <div className="flex justify-between items-start mb-4">
              <MicrophoneInput
                onTranscript={handleTranscript}
                isEnabled={!!getCurrentPage()}
              />
            </div>
            <textarea
              value={getCurrentPage()?.content || ''}
              onChange={(e) => updateCurrentPage(e.target.value)}
              className="w-full h-[500px] p-4 bg-transparent border-none focus:ring-0 font-serif text-gray-800 resize-none"
              placeholder="Start writing your story here..."
              style={{ 
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
                lineHeight: '32px',
                padding: '8px 16px'
              }}
            />
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className="p-2 text-amber-700 hover:text-amber-900 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-amber-900 font-medium">
              Page {currentPageIndex + 1} of {pages.length}
            </span>
            <button
              onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
              disabled={currentPageIndex === pages.length - 1}
              className="p-2 text-amber-700 hover:text-amber-900 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 border-t border-amber-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={addNewPage}
                className="inline-flex items-center px-3 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Page
              </button>
              <button
                onClick={deletePage}
                disabled={pages.length <= 1}
                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Page
              </button>
              <button
                onClick={() => setIsDragging(!isDragging)}
                className="inline-flex items-center px-3 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                <MoveVertical className="w-4 h-4 mr-1" />
                Rearrange
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="inline-flex items-center px-3 py-2 border border-amber-300 rounded-md shadow-sm text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {showPrompt ? 'Hide Prompt' : 'Show Prompt'}
              </button>
              <button
                onClick={getSuggestion}
                disabled={isLoading || !getCurrentPage()?.content.trim()}
                className="inline-flex items-center px-3 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Get Suggestion
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDragging && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h4 className="font-medium text-gray-900 mb-2">Rearrange Pages</h4>
          <div className="space-y-2">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200"
              >
                <span>Page {page.number}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => movePage(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="p-1 text-amber-700 hover:text-amber-900 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => movePage(index, Math.min(pages.length - 1, index + 1))}
                    disabled={index === pages.length - 1}
                    className="p-1 text-amber-700 hover:text-amber-900 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestion && (
        <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h3 className="font-medium text-green-900">Writing Suggestion</h3>
            <p className="text-green-700 mt-1">{suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}