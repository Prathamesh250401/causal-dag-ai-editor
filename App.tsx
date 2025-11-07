
import React, { useState, useCallback } from 'react';
import DagVisualizer from './components/DagVisualizer';
import ChatInterface from './components/ChatInterface';
import { DagData, DagResponse, ChatMessage } from './types';
import { INITIAL_DAG_DATA } from './constants';
import { updateDagWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [dagData, setDagData] = useState<DagData>(INITIAL_DAG_DATA.data);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: Date.now(),
      sender: 'ai',
      text: 'Hello! I can help you edit the Causal DAG. How can I assist you today? Try one of the examples below.'
    }
  ]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: message
    };
    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      const { newDagData, fullPrompt } = await updateDagWithGemini(dagData, message);
      setDagData(newDagData);
      
      const newAiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I've updated the DAG based on your request. The graph has been refreshed.",
        prompt: fullPrompt,
      };
      setChatMessages(prev => [...prev, newAiMessage]);

    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred.";
      setError(errorMessage);
       const newErrorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'system',
        text: `Error: ${errorMessage}`
      };
      setChatMessages(prev => [...prev, newErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [dagData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-6 lg:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Causal DAG <span className="text-indigo-400">AI Editor</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Edit your Marketing Mix Model's Causal Graph using natural language.
        </p>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-120px)]">
        <div className="lg:col-span-3 h-full">
            <DagVisualizer data={dagData} />
        </div>
        <div className="lg:col-span-2 h-full">
            <ChatInterface 
                messages={chatMessages} 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
            />
        </div>
      </main>
    </div>
  );
};

export default App;