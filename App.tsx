
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './components/MessageBubble';
import { MentorMessage } from './types';
import { getMentorResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Session initialized. I am Fsociety-Speaker.\n\nReady for mobile mentoring. I will correct your English while we discuss business and mindset strategy.",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage: MentorMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getMentorResponse(currentInput, messages);
      
      const assistantMessage: MentorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.mentorResponse,
        corrections: response.corrections,
        overallFeedback: response.overallFeedback,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "Network interruption. Check your connection.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 max-w-2xl mx-auto border-x border-slate-900 shadow-2xl overflow-hidden">
      {/* App Header - Sticky and Safe */}
      <header className="p-4 pt-6 border-b border-slate-900 flex items-center justify-between bg-slate-950/90 backdrop-blur-xl sticky top-0 z-20 no-select">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <i className="fa-solid fa-terminal text-slate-950 text-sm"></i>
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white mono text-md leading-none">Fsociety-Speaker</h1>
            <p className="text-[9px] text-slate-500 mono mt-1">v1.0.4-stable</p>
          </div>
        </div>
        <div className="px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
          <span className="text-[9px] text-emerald-400 font-bold uppercase mono animate-pulse">Live_Link</span>
        </div>
      </header>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar"
      >
        <div className="space-y-2 pb-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 py-2 mono text-[10px] text-slate-500 ml-1">
              <span className="inline-block w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
              <span>analyzing_input...</span>
            </div>
          )}
        </div>
      </div>

      {/* Native-style Input Area */}
      <div className="p-4 pb-8 bg-slate-950 border-t border-slate-900 no-select">
        <form onSubmit={handleSendMessage} className="relative group">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Send command..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 pr-14 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/5 transition-all resize-none text-slate-200 text-sm mono"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-white text-slate-950 active:scale-95 disabled:opacity-20 flex items-center justify-center transition-all shadow-lg"
          >
            {isTyping ? (
              <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
            ) : (
              <i className="fa-solid fa-arrow-up"></i>
            )}
          </button>
        </form>
        
        <div className="mt-4 flex justify-between items-center opacity-20 text-[8px] mono uppercase tracking-widest font-bold px-1">
          <div className="flex gap-3">
            <span>MEM: {Math.floor(Math.random() * 100) + 200}MB</span>
            <span>CPU: {Math.floor(Math.random() * 5)}%</span>
          </div>
          <span>Secure_Shell_Active</span>
        </div>
      </div>
    </div>
  );
};

export default App;
