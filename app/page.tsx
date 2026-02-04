'use client';

import { useState, useEffect } from 'react';
import { Sparkles, FileText, Image, Mail, Loader2, Copy, Download, Check, AlertCircle, Clock, Trash2, History } from 'lucide-react';

type ContentType = 'blog' | 'social' | 'email' | 'product';

interface GeneratedContent {
  id: string;
  text: string;
  contentType: ContentType;
  prompt: string;
  timestamp: Date;
}

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_content_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ai_content_history', JSON.stringify(history));
  }, [history]);

  const contentTypes = [
    { id: 'blog' as ContentType, name: 'Blog Post', icon: FileText, color: 'bg-blue-500' },
    { id: 'social' as ContentType, name: 'Social Media', icon: Sparkles, color: 'bg-pink-500' },
    { id: 'email' as ContentType, name: 'Email', icon: Mail, color: 'bg-green-500' },
    { id: 'product' as ContentType, name: 'Product Description', icon: Image, color: 'bg-purple-500' },
  ];

  const tones = ['professional', 'casual', 'friendly', 'formal', 'humorous', 'persuasive'];
  const lengths = ['short', 'medium', 'long'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentContent('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, prompt, tone, length }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedText += chunkValue;
        setCurrentContent(accumulatedText);
      }

      // Save to history once complete
      const newEntry: GeneratedContent = {
        id: Date.now().toString(),
        text: accumulatedText,
        contentType,
        prompt,
        timestamp: new Date(),
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10

    } catch (err) {
      console.error('Error generating content:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: GeneratedContent | string, type?: string) => {
    const text = typeof content === 'string' ? content : content.text;
    const fileName = typeof content === 'string' ? `${type || 'ai'}-content` : `${content.contentType}-content`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your history?')) {
      setHistory([]);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">AI Content PRO</h1>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">Professional Intelligence</p>
              </div>
            </div>
            {!process.env.OPENAI_API_KEY && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Simulated AI Engine</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300 animate-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar - History */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white">
                  <History className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Recent History</h2>
                </div>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentContent(item.text)}
                    className="group p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                        {item.contentType}
                      </span>
                      <button
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                    <p className="text-white/80 text-xs line-clamp-2 leading-relaxed mb-2 italic">
                      "{item.prompt}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] text-white/40">
                      <Clock className="w-3 h-3" />
                      {item.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-xs text-white/30">No history yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Configuration
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-indigo-300/80 uppercase tracking-widest mb-3 block">Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {contentTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setContentType(type.id)}
                          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${contentType === type.id
                              ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/10'
                              : 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                          <Icon className={`w-5 h-5 ${contentType === type.id ? 'text-indigo-400' : ''}`} />
                          <span className="text-xs font-semibold">{type.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-300/80 uppercase tracking-widest mb-3 block">Objective</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Benefits of renewable energy for small businesses..."
                    className="w-full h-28 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none text-sm leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-indigo-300/80 uppercase tracking-widest mb-3 block">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      {tones.map((t) => (
                        <option key={t} value={t} className="bg-slate-900 capitalize">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-300/80 uppercase tracking-widest mb-3 block">Length</label>
                    <div className="flex p-1 bg-black/20 border border-white/10 rounded-xl">
                      {lengths.map((l) => (
                        <button
                          key={l}
                          onClick={() => setLength(l)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-tighter ${length === l ? 'bg-indigo-500 text-white shadow-md' : 'text-white/40 hover:text-white/60'
                            }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing AI Stream...</>
                  ) : (
                    <><Sparkles className="w-5 h-5 group-hover:animate-pulse" /> Generate Content</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden sticky top-24">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Output</h2>
                {currentContent && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCopy(currentContent)}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
                      title="Copy"
                    >
                      <Copy className={`w-4 h-4 ${copied ? 'text-green-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDownload(currentContent, contentType)}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-[600px] overflow-y-auto bg-black/20 p-6 scrollbar-thin scrollbar-thumb-white/5">
                {currentContent ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-white/90 text-sm leading-8 whitespace-pre-wrap font-light tracking-wide animate-in fade-in duration-700">
                      {currentContent}
                      {loading && (
                        <span className="inline-block w-2 h-4 bg-indigo-500 ml-1.5 animate-pulse shadow-[0_0_8px_indigo]" />
                      )}
                    </div>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-indigo-300/40">
                    <Loader2 className="w-12 h-12 animate-spin mb-6 stroke-1" />
                    <p className="text-xs font-medium tracking-[0.2em] uppercase">Connecting to AI Node...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/10 text-center px-8">
                    <div className="w-20 h-20 border border-white/5 rounded-3xl flex items-center justify-center mb-6">
                      <History className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2">Editor Ready</p>
                    <p className="text-[11px] font-medium leading-relaxed max-w-[200px]">Configure your settings and click generate to initiate content production.</p>
                  </div>
                )}
              </div>

              {copied && (
                <div className="absolute bottom-4 right-4 animate-in slide-in-from-bottom-2">
                  <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded-lg shadow-xl backdrop-blur-md">
                    ✓ Content Synced
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
