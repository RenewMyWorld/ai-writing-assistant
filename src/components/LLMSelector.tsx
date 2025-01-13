import React from 'react';
import { Brain, Download } from 'lucide-react';
import type { LLMConfig } from '../types';

const availableModels = [
  {
    id: 'opt-6.7b',
    name: 'OPT-6.7B',
    size: '13.3 GB',
    description: 'Meta AI\'s Open Pretrained Transformer model'
  },
  {
    id: 'bloom',
    name: 'BLOOM',
    size: '14.1 GB',
    description: 'BigScience\'s multilingual language model'
  },
  {
    id: 'falcon-7b',
    name: 'Falcon-7B',
    size: '14.7 GB',
    description: 'TII\'s state-of-the-art open-source language model'
  },
  {
    id: 'mpt-7b',
    name: 'MPT-7B',
    size: '14.0 GB',
    description: 'MosaicML\'s open-source LLM trained on 1T tokens'
  },
  {
    id: 'custom',
    name: 'Custom Model',
    description: 'Use your own model'
  }
];

export default function LLMSelector({ config, onChange }: {
  config: LLMConfig;
  onChange: (config: LLMConfig) => void;
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">LLM Configuration</h2>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {availableModels.map((model) => (
            <div
              key={model.id}
              className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer hover:border-indigo-500 ${
                config.model === model.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
              onClick={() => onChange({ ...config, model: model.id })}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{model.description}</p>
                {model.size && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Download className="w-4 h-4 mr-1" />
                    {model.size}
                  </div>
                )}
              </div>
              <div className="ml-3 flex h-6 items-center">
                <input
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={config.model === model.id}
                  onChange={() => onChange({ ...config, model: model.id })}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model Directory</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={config.directory}
              onChange={(e) => onChange({ ...config, directory: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="/path/to/models"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Directory where your LLM models are stored
          </p>
        </div>
      </div>
    </div>
  );
}