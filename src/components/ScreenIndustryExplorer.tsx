import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Layers, 
  UserCheck, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  SlidersHorizontal, 
  Cpu, 
  Laptop, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Building,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Filter,
  MoveHorizontal,
  X,
  GripHorizontal
} from 'lucide-react';
import { AgentListing, ScreenType } from '../types';
import { INDUSTRIES_LIST, ROLES_LIST } from '../data/marketplaceData';

interface ScreenIndustryExplorerProps {
  listings: AgentListing[];
  onNavigate: (screen: ScreenType) => void;
  onSelectAgentForMarketplace?: (agentId: string) => void;
  userRole?: string;
  userIndustry?: string;
}

export const ScreenIndustryExplorer: React.FC<ScreenIndustryExplorerProps> = ({
  listings,
  onNavigate,
  userRole = '',
  userIndustry = '',
}) => {
  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    userIndustry && userIndustry !== 'Cross-Industry' ? userIndustry : 'All Industries'
  );
  const [selectedRole, setSelectedRole] = useState<string>(
    userRole && ROLES_LIST.includes(userRole) ? userRole : 'All Roles'
  );

  // Swipeable state for dropdown menu (Screen 3)
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Touch handlers for swipe away
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    // Provide slight visual feedback when swiping up or sideways
    if (deltaY < 0) {
      setSwipeOffset(deltaY);
    } else if (Math.abs(deltaX) > 10) {
      setSwipeOffset(Math.sign(deltaX) * Math.min(Math.abs(deltaX), 60));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;

    // Swiping away: swipe up by 30px OR swipe sideways by 45px dismisses dropdown
    if (deltaY < -30 || Math.abs(deltaX) > 45) {
      setIsDropdownOpen(false);
    }
    touchStartRef.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  // Active tab inside explorer
  const [activeTab, setActiveTab] = useState<'solutions' | 'advisor'>('solutions');

  // Remembered toggle: Display focus mode (stored in localStorage)
  const [focusMode, setFocusMode] = useState<'roi' | 'workflow'>(() => {
    return (localStorage.getItem('geek_ai_explorer_focus') as 'roi' | 'workflow') || 'roi';
  });

  useEffect(() => {
    localStorage.setItem('geek_ai_explorer_focus', focusMode);
  }, [focusMode]);

  // Dynamic interactive assessment form inside the Explorer
  const [advisorIndustry, setAdvisorIndustry] = useState(INDUSTRIES_LIST[1]);
  const [advisorRole, setAdvisorRole] = useState(ROLES_LIST[1]);
  const [advisorPainPoint, setAdvisorPainPoint] = useState('');
  const [generatedRecommendation, setGeneratedRecommendation] = useState<{
    suggestedTitle: string;
    agentPattern: string;
    expectedROI: string;
    recommendedAgentId?: string;
  } | null>(null);

  // Filter listings based on keyword, industry, and role
  const filteredListings = listings.filter((item) => {
    // Industry filter
    if (selectedIndustry !== 'All Industries' && !item.industry.toLowerCase().includes(selectedIndustry.toLowerCase())) {
      return false;
    }

    // Role filter
    if (selectedRole !== 'All Roles') {
      const matchesRole = item.targetRoles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()));
      if (!matchesRole) return false;
    }

    // Keyword search
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchProblem = item.problemSolved.toLowerCase().includes(q);
      const matchCapabilities = item.coreCapabilities.some((c) => c.toLowerCase().includes(q));
      const matchVendor = item.vendorName.toLowerCase().includes(q);
      const matchIndustry = item.industry.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchProblem && !matchCapabilities && !matchVendor && !matchIndustry) {
        return false;
      }
    }

    return true;
  });

  const handleAdvisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find closest matching listing
    const match = listings.find((l) => l.industry.toLowerCase().includes(advisorIndustry.toLowerCase())) || listings[0];
    setGeneratedRecommendation({
      suggestedTitle: `Autonomous Agent Architecture for ${advisorIndustry}`,
      agentPattern: `Multi-Agent Orchestration with Human-in-the-Loop Safeguards for ${advisorRole}`,
      expectedROI: 'Estimated 65-80% workload reduction and sub-minute response SLA',
      recommendedAgentId: match.id,
    });
  };

  return (
    <div id="screen-explorer" className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-850/95 backdrop-blur-md border-b border-slate-700 p-3.5 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discovery & Possibilities</span>
          </div>
          <h2 className="text-base font-bold text-white">Industry Solution Explorer</h2>
          <p className="text-xs text-slate-400">
            Unsure what agentic AI you need? Discover tailored patterns by sector and role.
          </p>
        </div>

        {/* Navigation tabs inside Explorer */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-800 border border-slate-750 rounded-xl">
          <button
            id="tab-explorer-solutions"
            onClick={() => setActiveTab('solutions')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'solutions'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Explore Solutions ({filteredListings.length})
          </button>

          <button
            id="tab-explorer-advisor"
            onClick={() => setActiveTab('advisor')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'advisor'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Need Blueprint Generator
          </button>
        </div>

        {/* Filter Controls (Shown for solutions tab) */}
        {activeTab === 'solutions' && (
          <div className="space-y-2 pt-1">
            {/* Keyword Search */}
            <div className="relative">
              <input
                id="explorer-keyword-search"
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by problem keyword, e.g. 'compliance', 'burnout', 'defect'..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs px-3.5 py-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Swipeable Industry and Role Dropdown Menu */}
            {!isDropdownOpen ? (
              /* Swiped Away / Collapsed Bar - does not block full page view */
              <div
                id="banner-collapsed-dropdown"
                onClick={() => setIsDropdownOpen(true)}
                className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs cursor-pointer hover:border-slate-600 transition shadow-sm select-none"
                title="Click or tap to reopen dropdown filter menu"
              >
                <div className="flex items-center gap-2 overflow-hidden text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Filter className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">Dropdowns Swiped Away • Tap to View:</span>
                    <span className="font-semibold text-white text-xs truncate block">
                      {selectedIndustry === 'All Industries' ? 'All Industries' : selectedIndustry} • {selectedRole === 'All Roles' ? 'All Roles' : selectedRole}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-expand-dropdown-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(true);
                  }}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition shrink-0 ml-2"
                >
                  <span>Expand</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Active Swipeable Dropdown Container */
              <div
                id="swipeable-dropdown-menu"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: swipeOffset !== 0 ? `translate(${swipeOffset}px, ${swipeOffset < 0 ? swipeOffset : 0}px)` : undefined,
                  transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
                }}
                className="bg-slate-800/95 border border-slate-700 rounded-2xl p-3 space-y-2.5 shadow-xl relative select-none"
              >
                {/* Swipe Handle Bar & Dismiss Control */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <GripHorizontal className="w-4 h-4 text-emerald-400" />
                    <span>Swipe up/sideways to dismiss menu</span>
                  </div>

                  <button
                    id="btn-swipe-away-dropdown"
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded-md bg-slate-700 hover:bg-slate-650 flex items-center gap-1 transition"
                    title="Swipe away or collapse dropdown menu"
                  >
                    <span>Swipe away</span>
                    <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

                {/* Industry and Role Sort Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-400" />
                      <span>Sort / Filter by Industry:</span>
                    </label>
                    <select
                      id="select-explorer-industry"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {INDUSTRIES_LIST.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-blue-400" />
                      <span>Sort / Filter by Role:</span>
                    </label>
                    <select
                      id="select-explorer-role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {ROLES_LIST.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Remembered Toggle: Highlight ROI Metric vs Highlight Workflow */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-750 text-xs">
              <span className="text-[11px] text-slate-400">Card View Focus:</span>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                <button
                  id="toggle-explorer-focus-roi"
                  onClick={() => setFocusMode('roi')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    focusMode === 'roi'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Highlight business ROI and problem solved"
                >
                  ROI & Bottlenecks
                </button>
                <button
                  id="toggle-explorer-focus-workflow"
                  onClick={() => setFocusMode('workflow')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    focusMode === 'workflow'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Highlight agent capabilities & credentials"
                >
                  Agent Capabilities
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 space-y-4 flex-1">
        {activeTab === 'solutions' ? (
          <>
            {filteredListings.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No exact industry match found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Try switching back to "All Industries" or "All Roles" to see how agents in other fields solve similar automation problems.
                </p>
                <button
                  onClick={() => {
                    setSelectedIndustry('All Industries');
                    setSelectedRole('All Roles');
                    setSearchKeyword('');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition"
                >
                  Reset Explorer Filters
                </button>
              </div>
            ) : (
              filteredListings.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  {/* Category & Target Role Badge */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      {solution.industry}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {solution.yearsFunctioning} yrs in field • {solution.basedIn}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{solution.name}</h3>
                    <p className="text-xs text-slate-400">By {solution.vendorName} ({solution.type})</p>
                  </div>

                  {/* Target Roles Pill List */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Ideal for Roles:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {solution.targetRoles.map((role, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-900 border border-slate-750 text-blue-300 px-2 py-0.5 rounded-md font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Focus Mode Dynamic Section */}
                  {focusMode === 'roi' ? (
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Problem It Solves & Operational ROI:</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{solution.problemSolved}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Core Agentic Capabilities:</span>
                      </div>
                      <ul className="space-y-1 text-slate-200">
                        {solution.coreCapabilities.map((cap, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pricing & Jump to Marketplace CTA */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Pricing Model</span>
                      <span className="text-xs font-bold text-white">
                        {solution.pricingAmount} ({solution.pricingModel})
                      </span>
                    </div>

                    <button
                      id={`btn-explore-view-marketplace-${solution.id}`}
                      onClick={() => onNavigate('marketplace')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <span>View in Marketplace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          /* Tab 2: AI Need Blueprint Generator Form */
          <div className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Interactive AI Need Advisor</span>
              </div>
              <p className="text-xs text-slate-300">
                Tell us about your organization's role and challenge. Our built-in matching engine will outline an agentic blueprint with recommended architecture.
              </p>

              <form onSubmit={handleAdvisorSubmit} className="space-y-3 text-xs pt-1">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Industry</label>
                  <select
                    value={advisorIndustry}
                    onChange={(e) => setAdvisorIndustry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INDUSTRIES_LIST.filter((i) => i !== 'All Industries').map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Organizational Role</label>
                  <select
                    value={advisorRole}
                    onChange={(e) => setAdvisorRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {ROLES_LIST.filter((r) => r !== 'All Roles').map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    What operational friction do you want to automate?
                  </label>
                  <textarea
                    rows={3}
                    value={advisorPainPoint}
                    onChange={(e) => setAdvisorPainPoint(e.target.value)}
                    placeholder="e.g. Inbound supplier paperwork takes 3 days of manual cross-checking before inventory can be logged..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                  />
                </div>

                <button
                  id="btn-generate-advisor-blueprint"
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Generate Agentic Solution Blueprint
                </button>
              </form>
            </div>

            {/* Generated Recommendation Result */}
            {generatedRecommendation && (
              <div className="bg-slate-800/90 border border-emerald-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Blueprint Recommendation</span>
                </div>

                <h4 className="text-sm font-bold text-white">{generatedRecommendation.suggestedTitle}</h4>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-750 text-xs space-y-2">
                  <p className="text-slate-300">
                    <strong className="text-white">Recommended Architecture:</strong>{' '}
                    {generatedRecommendation.agentPattern}
                  </p>
                  <p className="text-emerald-300 font-medium">
                    <strong>Projected Impact:</strong> {generatedRecommendation.expectedROI}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('marketplace')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <span>See Matching Verified Agents in Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
