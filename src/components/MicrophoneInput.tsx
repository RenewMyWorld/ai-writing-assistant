import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface MicrophoneInputProps {
  onTranscript: (text: string) => void;
  isEnabled: boolean;
}

export default function MicrophoneInput({ onTranscript, isEnabled }: MicrophoneInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');

        // Handle voice commands
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes('new line')) {
          onTranscript('\n');
        } else if (lowerTranscript.includes('delete last sentence')) {
          // Send special command to parent
          onTranscript('__DELETE_LAST_SENTENCE__');
        } else {
          onTranscript(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access denied');
        } else {
          setError('Error accessing microphone');
        }
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript]);

  const toggleRecording = useCallback(() => {
    if (!recognition || !isEnabled) return;

    if (!isRecording) {
      setError(null);
      recognition.start();
      setIsRecording(true);
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition, isRecording, isEnabled]);

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleRecording}
        disabled={!isEnabled || !!error}
        className={`
          p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isRecording 
            ? 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-indigo-500'
          }
          ${!isEnabled || !!error ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        title={error || (isRecording ? 'Stop recording' : 'Start recording')}
      >
        {isRecording ? (
          <Mic className="h-5 w-5 animate-pulse" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>

      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48">
          <div className="bg-red-50 text-red-600 text-sm py-1 px-2 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="absolute top-0 right-0 h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </div>
      )}
    </div>
  );
}