import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import ProjectForm from './components/ProjectForm';
import LLMSelector from './components/LLMSelector';
import WritingEditor from './components/WritingEditor';
import SavedStories from './components/SavedStories';
import type { LLMConfig, Project } from './types';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState<'editor' | 'saved' | 'profile' | 'settings'>('editor');
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({
    model: 'opt-6.7b',
    directory: '/models',
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  const handleNavigate = (page: 'editor' | 'saved' | 'profile' | 'settings') => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {currentPage === 'saved' ? (
          <SavedStories onLoadStory={(story) => {
            setCurrentProject(story);
            setCurrentPage('editor');
          }} />
        ) : currentPage === 'editor' ? (
          <>
            <LLMSelector config={llmConfig} onChange={setLLMConfig} />
            <ProjectForm 
              initialProject={currentProject}
              onSave={(project) => setCurrentProject(project)}
            />
            <WritingEditor 
              project={currentProject}
              onSave={(content) => {
                if (currentProject) {
                  setCurrentProject({ ...currentProject, content });
                }
              }}
            />
          </>
        ) : currentPage === 'profile' ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Profile Coming Soon</h2>
            <p className="mt-2 text-gray-600">This feature is under development.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Settings Coming Soon</h2>
            <p className="mt-2 text-gray-600">This feature is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}