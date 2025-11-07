
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageItem: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  if (msg.sender === 'system') {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center font-bold text-white flex-shrink-0 text-lg">
          !
        </div>
        <div className="p-3 rounded-lg max-w-sm bg-red-900/50 text-red-300">
          <p className="text-sm">{msg.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
        <div className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.sender === 'ai' && (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0">
              AI
            </div>
          )}
          <div className={`p-3 rounded-lg max-w-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>
            <p className="text-sm">{msg.text}</p>
            {msg.sender === 'ai' && msg.prompt && (
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                {showPrompt ? 'Hide Prompt' : 'Share Prompt'}
              </button>
            )}
          </div>
        </div>
      {showPrompt && msg.prompt && (
         <div className="flex justify-start">
            <pre className="ml-11 p-3 bg-gray-900/70 border border-gray-700 text-xs text-gray-300 rounded-lg overflow-x-auto w-full max-w-sm">
                <code>{msg.prompt}</code>
            </pre>
        </div>
      )}
    </div>
  );
};


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const examplePrompts = [
    "Add an edge from meta_spend to branded_search_volume",
    "Remove the link between google_spend and Revenue",
    "Create a potential direct connection from branded_search_volume to Revenue"
  ];

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
           {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                AI
              </div>
              <div className="p-3 rounded-lg bg-gray-700 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="mb-2 flex flex-wrap gap-2">
            {examplePrompts.map((prompt, i) => (
                 <button key={i} onClick={() => handleExampleClick(prompt)} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded-full transition-colors">
                    {prompt}
                 </button>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Add an edge from X to Y"
            className="flex-1 p-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;