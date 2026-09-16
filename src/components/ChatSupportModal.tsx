import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  User, 
  Compass, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const ChatSupportModal: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, isChatTyping } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I apply for a Saudi Tourist eVisa?',
    'What is included in the VIP Umrah Package?',
    'Can you track flight EK202 for me?',
    'What are the best photography spots in Banff?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  if (!isChatOpen) {
    // Floating Trigger Pill in bottom right corner
    return (
      <button
        id="open-live-chat-btn"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-teal-700 hover:bg-teal-800 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-teal-500/50 hover:scale-105 active:scale-95 transition-all group"
        title="24/7 Live AI Travel Concierge"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline group-hover:inline">
          Live Support
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatTyping) return;
    const text = inputText;
    setInputText('');
    await sendChatMessage(text);
  };

  const handleQuickSend = async (q: string) => {
    if (isChatTyping) return;
    await sendChatMessage(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        id="live-chat-drawer"
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-teal-100 flex flex-col h-[85vh] sm:h-[650px] animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-sm font-black flex items-center gap-1.5">
                InspireGO Concierge
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <div className="text-[11px] text-teal-300">
                24/7 AI Travel Specialist • Instant Responses
              </div>
            </div>
          </div>

          <button
            id="close-live-chat-btn"
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-teal-50/70 border-b border-teal-100/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-teal-800 whitespace-nowrap">
            Suggestions:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickSend(q)}
              className="text-[11px] font-medium bg-white text-slate-700 px-3 py-1 rounded-full border border-teal-100 hover:border-teal-300 whitespace-nowrap shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
                    <Compass className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-teal-700 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${isUser ? 'text-teal-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isChatTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
              <RefreshCw className="w-3 h-3 animate-spin text-teal-600" />
              <span>InspireGO Assistant is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about visas, packages, flights, or Umrah..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || isChatTyping}
            className="p-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
