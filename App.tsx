
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Layout, 
  Code2, 
  ExternalLink, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Monitor, 
  Sparkles,
  Info,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Webshop, ViewState, User } from './types';
import { shopService } from './services/shopService';
import { generateShopTemplate } from './services/geminiService';
import { 
  APP_NAME, 
  DEFAULT_SHOP_HTML, 
  DEFAULT_SHOP_CSS, 
  DEFAULT_SHOP_JS 
} from './constants';
import SandboxedPreview from './components/SandboxedPreview';
import Blueprint from './components/Blueprint';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [shops, setShops] = useState<Webshop[]>([]);
  const [currentShop, setCurrentShop] = useState<Webshop | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load shops on mount
  useEffect(() => {
    setShops(shopService.getShops());
  }, []);

  const handleLogin = () => {
    const mockUser: User = { id: 'u1', email: 'hello@user.com', name: 'Demo User' };
    setUser(mockUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const createNewShop = () => {
    const newShop: Webshop = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'My New Webshop',
      slug: 'my-shop-' + Math.floor(Math.random() * 1000),
      html: DEFAULT_SHOP_HTML,
      css: DEFAULT_SHOP_CSS,
      js: DEFAULT_SHOP_JS,
      userId: user?.id || 'u1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentShop(newShop);
    setView('editor');
  };

  const editShop = (shop: Webshop) => {
    setCurrentShop({ ...shop });
    setView('editor');
  };

  const deleteShop = (id: string) => {
    if (confirm('Are you sure you want to delete this shop?')) {
      shopService.deleteShop(id);
      setShops(shopService.getShops());
    }
  };

  const saveShopChanges = () => {
    if (currentShop) {
      shopService.saveShop({ ...currentShop, updatedAt: Date.now() });
      setShops(shopService.getShops());
      alert('Shop saved successfully!');
    }
  };

  const handleAiGenerate = async () => {
    if (!currentShop) return;
    const category = prompt("What kind of store is this? (e.g. Vintage clothes, Tech gadgets, Bakery)");
    if (!category) return;

    setIsGenerating(true);
    try {
      const result = await generateShopTemplate(currentShop.name, category);
      setCurrentShop({
        ...currentShop,
        html: result.html,
        css: result.css,
        js: result.js
      });
    } catch (error) {
      console.error("AI generation failed", error);
      alert("Failed to generate template. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Nav component
  const Navbar = () => (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code2 className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setView('blueprint')} className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-2">
              <Info size={16} /> Blueprint
            </button>
            {user ? (
              <>
                <button onClick={() => setView('dashboard')} className="text-slate-600 hover:text-slate-900 text-sm font-medium">Dashboard</button>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button onClick={handleLogin} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 pb-4 px-4 space-y-2">
          <button onClick={() => { setView('blueprint'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-600 font-medium">Blueprint</button>
          {user ? (
            <>
              <button onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-slate-600 font-medium">Dashboard</button>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg mt-4">Sign In</button>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {view === 'landing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Paste Code. <br />
              <span className="text-blue-600">Launch Your Shop.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              The easiest way to host your frontend webshop. No deployment pipelines, no servers. Just paste your HTML/CSS/JS and go live in seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-800 transition flex items-center gap-2"
              >
                Get Started for Free <Plus size={20} />
              </button>
              <button 
                onClick={() => setView('blueprint')}
                className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition"
              >
                View System Plan
              </button>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Monitor size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Preview</h3>
                <p className="text-slate-500">Edit your shop in real-time and see changes instantly in a secure environment.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Generation</h3>
                <p className="text-slate-500">Don't have code? Tell Gemini what you're selling and we'll build the UI for you.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                  <ExternalLink size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Subdomains</h3>
                <p className="text-slate-500">Every shop gets its own unique URL slug. Ready for your customers immediately.</p>
              </div>
            </div>
          </div>
        )}

        {view === 'blueprint' && (
          <Blueprint />
        )}

        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Your Webshops</h2>
                <p className="text-slate-500">Manage and update your published storefronts.</p>
              </div>
              <button 
                onClick={createNewShop}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus size={20} /> Create New Shop
              </button>
            </div>

            {shops.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <Layout className="mx-auto text-slate-300 w-16 h-16 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No shops yet</h3>
                <p className="text-slate-500 mb-6">Start by creating your first instant webshop.</p>
                <button onClick={createNewShop} className="text-blue-600 font-bold hover:underline">Get started &rarr;</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map(shop => (
                  <div key={shop.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                        <Layout size={24} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => deleteShop(shop.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{shop.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 font-mono">{shop.slug}.shopinsta.com</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editShop(shop)}
                        className="flex-1 bg-slate-900 text-white text-sm font-bold py-2 rounded-lg hover:bg-slate-800"
                      >
                        Edit Code
                      </button>
                      <button 
                        onClick={() => { setCurrentShop(shop); setView('preview'); }}
                        className="px-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                      >
                        <Monitor size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'editor' && currentShop && (
          <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-slate-900">
            {/* Editor Panel */}
            <div className="w-full md:w-1/2 flex flex-col border-r border-slate-700 bg-slate-800">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <input 
                    value={currentShop.name}
                    onChange={(e) => setCurrentShop({...currentShop, name: e.target.value})}
                    className="bg-transparent text-white font-bold text-lg border-none focus:ring-0 w-48"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles size={16} /> {isGenerating ? 'Generating...' : 'AI Generate'}
                  </button>
                  <button 
                    onClick={saveShopChanges}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>

              <div className="p-4 flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 border-b border-slate-800 overflow-x-auto">
                <span className="text-blue-400 border-b-2 border-blue-400 pb-2 cursor-pointer">index.html</span>
                <span className="hover:text-slate-300 cursor-not-allowed">style.css</span>
                <span className="hover:text-slate-300 cursor-not-allowed">main.js</span>
              </div>

              <div className="flex-1 overflow-hidden p-2">
                <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 px-2 uppercase">HTML Content</label>
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-blue-100 font-mono text-sm p-4 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                      value={currentShop.html}
                      onChange={(e) => setCurrentShop({...currentShop, html: e.target.value})}
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 px-2 uppercase">CSS Styling</label>
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-pink-100 font-mono text-sm p-4 rounded-lg focus:ring-1 focus:ring-pink-500 outline-none resize-none"
                      value={currentShop.css}
                      onChange={(e) => setCurrentShop({...currentShop, css: e.target.value})}
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2 px-2 uppercase">JavaScript Logic</label>
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-yellow-100 font-mono text-sm p-4 rounded-lg focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
                      value={currentShop.js}
                      onChange={(e) => setCurrentShop({...currentShop, js: e.target.value})}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-100 overflow-hidden">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">Live Preview</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Synchronized</span>
                  </div>
               </div>
               <div className="flex-1 p-6 flex flex-col">
                  <div className="bg-white rounded-t-xl border-x border-t border-slate-200 h-8 flex items-center px-4 gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                    <div className="mx-4 bg-slate-50 rounded-md h-5 flex-1 px-3 flex items-center">
                      <span className="text-[10px] text-slate-400 font-mono truncate">https://{currentShop.slug}.shopinsta.com</span>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <SandboxedPreview 
                      html={currentShop.html} 
                      css={currentShop.css} 
                      js={currentShop.js} 
                      className="rounded-t-none"
                    />
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'preview' && currentShop && (
          <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col">
            <div className="bg-white h-16 border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('dashboard')} className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-bold text-slate-900">{currentShop.name} <span className="text-slate-400 font-normal">Preview</span></h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('editor')}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800"
                >
                  Edit Code
                </button>
                <button 
                  onClick={() => alert("Real domains are coming soon to Pro plans!")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                >
                  Visit Live <ExternalLink size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <SandboxedPreview html={currentShop.html} css={currentShop.css} js={currentShop.js} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="text-slate-400 w-5 h-5" />
            <span className="text-slate-600 font-bold">{APP_NAME}</span>
            <span className="text-slate-400 text-sm ml-2">© 2024 Instant Webshop Inc.</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <button onClick={() => setView('blueprint')} className="hover:text-slate-900">Architecture</button>
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
