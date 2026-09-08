import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Play, 
  MessageSquare, 
  Mail, 
  FileCheck, 
  PlusCircle, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  X, 
  Check, 
  Cpu, 
  Laptop, 
  ArrowUpDown,
  DollarSign,
  Tag,
  Eye,
  CheckCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { AgentListing, SolutionType, PricingModel } from '../types';

interface ScreenMarketplaceProps {
  listings: AgentListing[];
  onAddListing: (newListing: AgentListing) => void;
  selectedIndustryFilter?: string;
}

export const ScreenMarketplace: React.FC<ScreenMarketplaceProps> = ({
  listings,
  onAddListing,
  selectedIndustryFilter,
}) => {
  // Remembered Toggle for Verified Certifications filter
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(() => {
    return localStorage.getItem('geek_ai_verified_only') === 'true';
  });

  // Filter and Sort states
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPricing, setSelectedPricing] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'years' | 'price'>('rating');

  // Modal states for CTAs
  const [activeModal, setActiveModal] = useState<{
    type: 'chat' | 'contact' | 'request_demo' | 'watch_demo' | 'add_form';
    agent?: AgentListing;
  } | null>(null);

  // Form states for adding a new agent listing
  const [formName, setFormName] = useState('');
  const [formVendor, setFormVendor] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formType, setFormType] = useState<SolutionType>('Software');
  const [formIndustry, setFormIndustry] = useState('FinTech & Banking');
  const [formYears, setFormYears] = useState(3);
  const [formLocation, setFormLocation] = useState('Singapore');
  const [formClients, setFormClients] = useState('Apex Global, Nova Logistics');
  const [formCerts, setFormCerts] = useState('ISO/IEC 42001, SOC 2 Type II');
  const [formPricingModel, setFormPricingModel] = useState<PricingModel>('subscription');
  const [formPriceAmount, setFormPriceAmount] = useState('$1,500');
  const [formDescription, setFormDescription] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Save remembered toggle to localStorage
  useEffect(() => {
    localStorage.setItem('geek_ai_verified_only', String(verifiedOnly));
  }, [verifiedOnly]);

  // Handle Add Listing submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formVendor.trim()) return;

    const newAgent: AgentListing = {
      id: `geek-custom-${Date.now()}`,
      name: formName.trim(),
      tagline: formTagline.trim() || 'Custom Enterprise Agentic Solution',
      vendorName: formVendor.trim(),
      type: formType,
      industry: formIndustry,
      targetRoles: ['Chief Technology Officer', 'Operations Director'],
      yearsFunctioning: Number(formYears) || 2,
      basedIn: formLocation.trim() || 'Global HQ',
      clients: formClients.split(',').map((c) => c.trim()).filter(Boolean),
      certifications: formCerts.split(',').map((c) => c.trim()).filter(Boolean),
      pricingModel: formPricingModel,
      pricingAmount: formPriceAmount.startsWith('$') ? formPriceAmount : `$${formPriceAmount}`,
      billingPeriod: formPricingModel === 'subscription' ? '/ month' : 'one-time license',
      rating: 5.0,
      reviewCount: 1,
      description: formDescription.trim() || 'High-performance enterprise agentic AI system designed for workflow automation.',
      coreCapabilities: ['Autonomous pipeline execution', 'Enterprise API integration', 'Audited compliance trail'],
      problemSolved: 'Streamlines operational bottlenecks and eliminates repetitive human workloads.',
      demoTitle: `${formName} Live Capability Demonstration`,
      demoDuration: '3m 00s',
      demoHighlights: ['Instant setup', 'Custom policy enforcement', 'Role-based access'],
      isFeatured: true,
    };

    onAddListing(newAgent);
    setFormSuccessMessage(`"${newAgent.name}" was successfully listed on GEEK AI!`);
    setTimeout(() => {
      setFormSuccessMessage('');
      setActiveModal(null);
      // Reset form
      setFormName('');
      setFormVendor('');
      setFormTagline('');
      setFormDescription('');
    }, 1500);
  };

  // Filtered & Sorted listings
  const filteredListings = listings.filter((item) => {
    // Type filter
    if (selectedType !== 'All' && item.type !== selectedType) return false;
    // Pricing filter
    if (selectedPricing !== 'All' && item.pricingModel !== selectedPricing) return false;
    // Verified Only toggle filter
    if (verifiedOnly && item.certifications.length === 0) return false;
    // Industry filter (if passed from assessment or search)
    if (selectedIndustryFilter && selectedIndustryFilter !== 'All Industries') {
      if (!item.industry.toLowerCase().includes(selectedIndustryFilter.toLowerCase())) {
        // loose match
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchVendor = item.vendorName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchIndustry = item.industry.toLowerCase().includes(q);
      const matchClient = item.clients.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchVendor && !matchDesc && !matchIndustry && !matchClient) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'years') return b.yearsFunctioning - a.yearsFunctioning;
    if (sortBy === 'price') {
      const getNum = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
      return getNum(a.pricingAmount) - getNum(b.pricingAmount);
    }
    return 0;
  });

  return (
    <div id="screen-marketplace" className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Marketplace Sticky Top Header & Toggles */}
      <div className="sticky top-0 z-20 bg-slate-850/95 backdrop-blur-md border-b border-slate-700 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Agentic Marketplace</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                {filteredListings.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-400">Verified enterprise software & hardware agents</p>
          </div>

          <button
            id="btn-open-add-listing-form"
            onClick={() => setActiveModal({ type: 'add_form' })}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl font-semibold text-xs transition shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Solution</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            id="marketplace-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents, vendors, certifications, clients..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Badges & Remembered Verified Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Solution Type Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
            {['All', 'Software', 'Hardware', 'Hybrid Agent'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-lg font-medium transition text-xs whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Remembered Toggle: Verified Certifications Only */}
          <button
            id="toggle-verified-only"
            onClick={() => setVerifiedOnly((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              verifiedOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Filter by certified agents (stored in localStorage)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{verifiedOnly ? 'Certified Only: ON' : 'Certified Only: OFF'}</span>
          </button>
        </div>

        {/* Pricing Model Filter & Sorter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span>Model:</span>
            {['All', 'subscription', 'one-time'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedPricing(m)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                  selectedPricing === m
                    ? 'text-white font-semibold underline underline-offset-4 decoration-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'one-time' ? 'One-time fee' : m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-[11px] rounded border border-slate-700 px-1 py-0.5 focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="years">Years Active</option>
              <option value="price">Price Tier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings List */}
      <div className="p-3.5 space-y-4 flex-1">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-slate-400 space-y-2">
            <Info className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-300">No agentic solutions matched your filters.</p>
            <p className="text-xs text-slate-500">Try clearing the search query or resetting filters.</p>
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedPricing('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs text-emerald-400 underline font-medium"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredListings.map((agent) => {
            return (
              <div
                key={agent.id}
                id={`card-agent-${agent.id}`}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-3.5 hover:border-slate-600 transition shadow-lg relative overflow-hidden"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${
                          agent.type === 'Hardware'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : agent.type === 'Hybrid Agent'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {agent.type === 'Hardware' ? <Cpu className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                        {agent.type}
                      </span>
                      <span className="text-xs text-slate-400">• {agent.industry}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1 leading-snug">{agent.name}</h3>
                    <p className="text-xs text-emerald-400 font-medium">by {agent.vendorName}</p>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded-xl shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-white">{agent.rating}</span>
                    <span className="text-[10px] text-slate-400">({agent.reviewCount})</span>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs text-slate-300 italic">"{agent.tagline}"</p>

                {/* Key Metrics: Functioning years, Location, Pricing */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Functioning:</span>
                    </div>
                    <p className="font-semibold text-white pl-5">{agent.yearsFunctioning} Years in Production</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Based In:</span>
                    </div>
                    <p className="font-semibold text-white pl-5">{agent.basedIn}</p>
                  </div>
                </div>

                {/* Highlighted Clients */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>Recent / Well-Known Clients:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.clients.map((client, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-750 border border-slate-650 px-2 py-0.5 rounded-md text-slate-200"
                      >
                        {client}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications Obtained */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Certifications Obtained:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-emerald-950/40 text-emerald-300 border border-emerald-700/40 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detailed Mode: Always display description & problem solved */}
                <div className="space-y-2 pt-1 text-xs border-t border-slate-700/60">
                  <p className="text-slate-300 leading-relaxed">{agent.description}</p>
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px] text-emerald-300">
                    <strong className="text-emerald-400">Problem Solved:</strong> {agent.problemSolved}
                  </div>
                </div>

                {/* Pricing Banner: 1 Fixed Fee only */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Fixed Fee ({agent.pricingModel === 'subscription' ? 'Monthly' : 'One-Time License'}):
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-white">{agent.pricingAmount}</span>
                      <span className="text-xs text-slate-400">
                        {agent.pricingModel === 'subscription' ? '/ month (Fixed)' : '(1 Fixed Fee)'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 rounded bg-slate-750 border border-slate-700 text-slate-300">
                    SLA & Setup Included
                  </span>
                </div>

                {/* CTAs: Chat Now / Contact Us / Request a Demo / Watch a Demo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  <button
                    id={`btn-chat-now-${agent.id}`}
                    onClick={() => setActiveModal({ type: 'chat', agent })}
                    className="py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Now</span>
                  </button>

                  <button
                    id={`btn-contact-us-${agent.id}`}
                    onClick={() => setActiveModal({ type: 'contact', agent })}
                    className="py-2 px-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-100 font-medium text-xs flex items-center justify-center gap-1 border border-slate-600 transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Us</span>
                  </button>

                  <button
                    id={`btn-request-demo-${agent.id}`}
                    onClick={() => setActiveModal({ type: 'request_demo', agent })}
                    className="py-2 px-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-100 font-medium text-xs flex items-center justify-center gap-1 border border-slate-600 transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request Demo</span>
                  </button>

                  <button
                    id={`btn-watch-demo-${agent.id}`}
                    onClick={() => setActiveModal({ type: 'watch_demo', agent })}
                    className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Demo</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Watch Demo Simulator */}
      {activeModal?.type === 'watch_demo' && activeModal.agent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Play className="w-3 h-3 fill-indigo-400" /> Video Demo Player
                </span>
                <h3 className="text-base font-bold text-white">{activeModal.agent.demoTitle}</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Mockup */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 aspect-video flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  LIVE AGENT EXECUTION
                </span>
                <span>Duration: {activeModal.agent.demoDuration}</span>
              </div>

              <div className="text-center space-y-2 my-auto">
                <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto animate-pulse">
                  <Play className="w-7 h-7 fill-indigo-400 ml-1" />
                </div>
                <p className="text-sm font-semibold text-white">{activeModal.agent.name}</p>
                <p className="text-xs text-slate-400">Autonomous workflow walkthrough simulation</p>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-2/3 animate-pulse"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>01:45</span>
                  <span>{activeModal.agent.demoDuration}</span>
                </div>
              </div>
            </div>

            {/* Demo Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Demo Key Moments:</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModal.agent.demoHighlights.map((hl, i) => (
                  <li key={i} className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-lg border border-slate-750">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveModal({ type: 'request_demo', agent: activeModal.agent })}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition"
            >
              Liked this? Request Full Interactive Trial
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Chat Now Modal */}
      {activeModal?.type === 'chat' && activeModal.agent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl w-full max-w-md p-4 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Chat: {activeModal.agent.name}</h3>
                  <p className="text-xs text-emerald-400">Agent sandbox connected</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="bg-slate-800 p-2.5 rounded-lg text-slate-200">
                👋 Hello! I am the automated concierge for <strong>{activeModal.agent.name}</strong> from {activeModal.agent.basedIn}. How can our {activeModal.agent.type.toLowerCase()} agent solve your {activeModal.agent.industry} workflow bottlenecks today?
              </div>
              <div className="text-[11px] text-slate-400 italic">
                * Simulated agent sandbox ready for prompt testing.
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Ask about API compatibility, throughput, or security..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Inquiry submitted to ${activeModal.agent?.vendorName}! A technical representative will respond shortly.`)}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Send Inquiry
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Contact Us / Request Demo Modal */}
      {(activeModal?.type === 'contact' || activeModal?.type === 'request_demo') && activeModal.agent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl w-full max-w-md p-4 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeModal.type === 'contact' ? 'Contact Vendor' : 'Request Enterprise Demo'}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeModal.agent.name} • {activeModal.agent.vendorName}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Corporate Email</label>
                <input
                  type="email"
                  defaultValue="enterprise.lead@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Company & Department</label>
                <input
                  type="text"
                  defaultValue="Global Enterprises Inc. • Operations"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {activeModal.type === 'contact' ? 'Message / Technical Questions' : 'Preferred Demo Timeframe'}
                </label>
                <textarea
                  rows={2}
                  defaultValue={
                    activeModal.type === 'contact'
                      ? `We are interested in adopting ${activeModal.agent.name} for our ${activeModal.agent.industry} team. Please send compliance documents.`
                      : 'Next Tuesday at 2:00 PM SGT (Singapore Time)'
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>📍 Vendor HQ: {activeModal.agent.basedIn} ({activeModal.agent.yearsFunctioning} years functioning)</p>
                <p>🛡️ Covered by: {activeModal.agent.certifications.join(', ')}</p>
                <p>💳 Pricing: {activeModal.agent.pricingAmount} ({activeModal.agent.pricingModel})</p>
              </div>

              <button
                onClick={() => {
                  alert(`Request sent to ${activeModal.agent?.vendorName}! Reference ID: GEEK-${Date.now().toString().slice(-5)}`);
                  setActiveModal(null);
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                {activeModal.type === 'contact' ? 'Submit Inquiry' : 'Confirm Demo Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add New Agent Listing Form (Seller Form that updates what is shown) */}
      {activeModal?.type === 'add_form' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Enterprise Seller Portal</span>
                </div>
                <h3 className="text-base font-bold text-white">List Your Agentic Solution</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccessMessage ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/40 border border-emerald-500/50 rounded-xl">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">{formSuccessMessage}</h4>
                <p className="text-xs text-emerald-300">Listing added to live marketplace screen.</p>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Agent / Solution Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. NexusAgent Auto-Billing"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Vendor / Enterprise Name *</label>
                    <input
                      type="text"
                      required
                      value={formVendor}
                      onChange={(e) => setFormVendor(e.target.value)}
                      placeholder="e.g. Nexus AI Labs"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tagline / Short Pitch</label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Autonomous invoice matching with zero false positives"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Solution Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Software">Software Agent</option>
                      <option value="Hardware">Hardware Appliance</option>
                      <option value="Hybrid Agent">Hybrid Agent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Industry</label>
                    <select
                      value={formIndustry}
                      onChange={(e) => setFormIndustry(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="FinTech & Banking">FinTech & Banking</option>
                      <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                      <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                      <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                      <option value="Legal & Governance">Legal & Governance</option>
                      <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                      <option value="Cybersecurity & IT Operations">Cybersecurity & IT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Years Functioning</label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={formYears}
                      onChange={(e) => setFormYears(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Where is it Based?</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Singapore, Tokyo, Austin"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Pricing Model</label>
                    <select
                      value={formPricingModel}
                      onChange={(e) => setFormPricingModel(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="subscription">Subscription (Monthly)</option>
                      <option value="one-time">One-time Fee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Price Amount</label>
                    <input
                      type="text"
                      value={formPriceAmount}
                      onChange={(e) => setFormPriceAmount(e.target.value)}
                      placeholder="e.g. $1,500 or $32,000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Recent / Well-Known Clients</label>
                  <input
                    type="text"
                    value={formClients}
                    onChange={(e) => setFormClients(e.target.value)}
                    placeholder="Comma separated invented client names"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Certifications Obtained</label>
                  <input
                    type="text"
                    value={formCerts}
                    onChange={(e) => setFormCerts(e.target.value)}
                    placeholder="e.g. ISO/IEC 42001, SOC 2 Type II, HIPAA"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Description & Capabilities</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Explain what problem this agent solves and its core features..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    id="btn-submit-new-listing"
                    type="submit"
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Publish to Marketplace
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-3 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
