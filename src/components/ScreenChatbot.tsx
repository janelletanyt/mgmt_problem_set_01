import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Building2, 
  ShoppingBag, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle,
  Briefcase,
  CheckCircle2,
  FileQuestion,
  ChevronRight
} from 'lucide-react';
import { ChatMessage, UserAssessment, ScreenType } from '../types';

interface ScreenChatbotProps {
  onNavigate: (screen: ScreenType) => void;
  onAssessmentComplete: (assessment: UserAssessment) => void;
  currentAssessment: UserAssessment;
}

const INITIAL_BOT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: "Welcome to GEEK AI — the phone-first marketplace for agentic AI in enterprise workflows! 👋\n\nI am your onboarding concierge. To guide you to the right corner of our marketplace, are you visiting today as an Enterprise Seller or an Enterprise Buyer?",
    timestamp: 'Just now',
    category: 'persona',
    quickOptions: [
      '🏢 Enterprise Seller (I build/sell AI agents)',
      '🛍️ Enterprise Buyer (I want to adopt agents)',
      '🔍 Just Exploring Possibilities'
    ]
  }
];

export const ScreenChatbot: React.FC<ScreenChatbotProps> = ({ 
  onNavigate, 
  onAssessmentComplete,
  currentAssessment 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_BOT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [currentStep, setCurrentStep] = useState<'persona' | 'software' | 'role_industry' | 'problem' | 'complete'>('persona');
  const [assessment, setAssessment] = useState<UserAssessment>(currentAssessment);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotResponse = (text: string, options?: string[], category?: ChatMessage['category']) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newBotMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickOptions: options,
        category
      };
      setMessages((prev) => [...prev, newBotMsg]);
    }, 450);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // State machine progression
    if (currentStep === 'persona') {
      const isSeller = text.toLowerCase().includes('seller') || text.toLowerCase().includes('build');
      const newType = isSeller ? 'seller' : 'buyer';
      const updated = { ...assessment, userType: newType };
      setAssessment(updated);
      setCurrentStep('software');

      if (isSeller) {
        addBotResponse(
          "Great! Enterprise sellers can showcase their agentic software or hardware units on GEEK AI.\n\nWhat specific AI software or hardware is your business looking to sell or list? (e.g., autonomous dispatch software, edge vision inspection hardware, legal redlining agents, or custom workflow tools?)",
          [
            'Autonomous Workflow Software',
            'Edge AI Hardware Appliance',
            'Compliance & Risk Agent',
            'Customer Support & Sales Agent'
          ],
          'software_type'
        );
      } else {
        addBotResponse(
          "Excellent! We host verified agentic systems ready to integrate into your corporate tech stack.\n\nWhat AI software or hardware capabilities does your business want to buy or explore? (e.g., automated document auditing, customer service agents, edge sensor systems, dynamic pricing?)",
          [
            'Autonomous Document & Contract Agent',
            'Supply Chain Dispatch & Logistics',
            'Clinical & Healthcare Scribe Agent',
            'Edge Vision Hardware for Manufacturing',
            'FinTech AML & Fraud Sentinel'
          ],
          'software_type'
        );
      }
    } else if (currentStep === 'software') {
      const updated = { ...assessment, softwareInterest: text };
      setAssessment(updated);
      setCurrentStep('role_industry');

      addBotResponse(
        "Understood. To help tailor the right ecosystem partners:\n\nWhat is your role in the company, and what industry or sector are you focused on?",
        [
          'Operations Director • Supply Chain',
          'Chief Technology Officer • FinTech',
          'Chief Medical Officer • Healthcare',
          'General Counsel • Legal & Compliance',
          'Plant Manager • Manufacturing'
        ],
        'role_industry'
      );
    } else if (currentStep === 'role_industry') {
      // Split role and industry if possible
      let role = text;
      let industry = 'Cross-Industry';
      if (text.includes('•')) {
        const parts = text.split('•');
        role = parts[0].trim();
        industry = parts[1].trim();
      } else if (text.includes('in') || text.includes('at')) {
        role = text;
        industry = text;
      }

      const updated = { ...assessment, role, industry };
      setAssessment(updated);
      setCurrentStep('problem');

      addBotResponse(
        "Thank you! Here is the crucial question:\n\nWhat specific problems or operational bottlenecks does your business currently face, and how would you ideally like an agentic AI solution to solve it?",
        [
          'High manual labor hours in repetitive contract redlining and audits',
          'Carrier dispatch delays and high freight empty-mile costs',
          'Doctor burnout from 3+ hours daily of electronic health record charting',
          'Assembly line defect leakage slipping past human visual inspections'
        ],
        'problem_statement'
      );
    } else if (currentStep === 'problem') {
      const updated = {
        ...assessment,
        problemStatement: text,
        desiredOutcome: 'Automated agentic workflow with audited verification'
      };
      setAssessment(updated);
      setCurrentStep('complete');
      onAssessmentComplete(updated);

      addBotResponse(
        `🎉 Assessment completed!\n\nBased on your profile as a ${updated.userType === 'seller' ? 'Seller' : 'Buyer'} in ${updated.industry || 'your industry'}:\n• Interest: ${updated.softwareInterest}\n• Target Role: ${updated.role}\n• Key Bottleneck: "${text}"\n\nYou are ready to explore live offerings or post your listing!`,
        undefined,
        'completed'
      );
    } else {
      // Freeform chat after completion
      addBotResponse(
        `Noted: "${text}". Feel free to jump to Screen 2 to see verified marketplace vendors, or explore industry blueprints in Screen 3!`,
        ['Go to Marketplace (Screen 2)', 'Explore Industries (Screen 3)', 'Reset Chatbot']
      );
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === 'Go to Marketplace (Screen 2)') {
      onNavigate('marketplace');
      return;
    }
    if (option === 'Explore Industries (Screen 3)') {
      onNavigate('explorer');
      return;
    }
    if (option === 'Reset Chatbot') {
      handleReset();
      return;
    }
    handleSendMessage(option);
  };

  const handleReset = () => {
    setMessages(INITIAL_BOT_MESSAGES);
    setCurrentStep('persona');
    const blank: UserAssessment = {
      userType: null,
      softwareInterest: '',
      industry: '',
      role: '',
      problemStatement: '',
      desiredOutcome: '',
    };
    setAssessment(blank);
    onAssessmentComplete(blank);
  };

  return (
    <div id="screen-chatbot" className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Screen 1 Subheader / Context Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white">AI Onboarding Concierge</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </div>

        <button
          id="btn-reset-chat"
          onClick={handleReset}
          title="Restart Chat"
          className="text-xs text-slate-400 hover:text-slate-200 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Role Banner / Badge if determined */}
      {assessment.userType && (
        <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            {assessment.userType === 'seller' ? (
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            )}
            Mode: <strong className="text-white uppercase">{assessment.userType}</strong>
            {assessment.industry && <span className="text-slate-400">• {assessment.industry}</span>}
          </span>
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> Profile Active
          </span>
        </div>
      )}

      {/* Chat Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div className="flex items-end gap-2 max-w-[92%]">
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-[15px] leading-relaxed ${
                    isBot
                      ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-xs shadow-md'
                      : 'bg-emerald-600 text-white rounded-br-xs shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isBot ? 'text-slate-400' : 'text-emerald-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>

              {/* Quick Reply Pills */}
              {msg.quickOptions && msg.quickOptions.length > 0 && (
                <div className="mt-2.5 ml-9 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.quickOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      className="text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/50 px-3 py-2 rounded-xl transition duration-150 shadow-sm flex items-center gap-1.5"
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs ml-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
            <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-2xl flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        {/* Assessment Completion Card */}
        {currentStep === 'complete' && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Next Actions</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <p><strong className="text-white">Profile:</strong> {assessment.userType === 'seller' ? 'Enterprise AI Solution Seller' : 'Enterprise Agent Adopter (Buyer)'}</p>
              {assessment.softwareInterest && <p><strong className="text-white">Focus:</strong> {assessment.softwareInterest}</p>}
              {assessment.industry && <p><strong className="text-white">Sector:</strong> {assessment.industry}</p>}
              {assessment.problemStatement && <p><strong className="text-white">Target Problem:</strong> {assessment.problemStatement}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                id="btn-goto-marketplace-from-chat"
                onClick={() => onNavigate('marketplace')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>View Marketplace (Screen 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-goto-explorer-from-chat"
                onClick={() => onNavigate('explorer')}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <span>Explore Industries (Screen 3)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-slate-850 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-user-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentStep === 'problem'
                ? 'Describe your business problem & desired solution...'
                : currentStep === 'software'
                ? 'What software or hardware are you exploring?'
                : currentStep === 'role_industry'
                ? 'Type your role or industry...'
                : 'Type your message or tap an option above...'
            }
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            id="btn-submit-chat"
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center transition shadow-md shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex justify-between items-center px-1 pt-2 text-[11px] text-slate-400">
          <span>Tap quick buttons above or type free-form response</span>
          <span>GEEK AI Concierge</span>
        </div>
      </div>
    </div>
  );
};
