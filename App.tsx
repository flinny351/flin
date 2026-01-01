
import React, { useState, useEffect } from 'react';
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
  LogOut,
  Globe,
  Settings,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { Webshop, ViewState, User } from './types';
import { shopService } from './services/shopService';
import { authService } from './services/authService';
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

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Initial Auth & Route Check
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Check if we're simulating a live shop via URL params
    const params = new URLSearchParams(window.location.search);
    const shopSlug = params.get('shop');
    if (shopSlug) {
      const shop = shopService.getShopBySlug(shopSlug);
      if (shop) {
        setCurrentShop(shop);
        setView('live');
      }
    } else if (currentUser) {
      setView('dashboard');
    }
  }, []);

  // Sync shops when user changes or view enters dashboard
  useEffect(() => {
    if (user) {
      setShops(shopService.getShopsForUser(user.id));
    }
  }, [user, view]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authService.signup({ email, password, name });
      handleLogin(e);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = authService.login(email, password);
      setUser(loggedInUser);
      setView('dashboard');
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
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
      status: 'online',
      userId: user?.id || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentShop(newShop);
    setView('editor');
  };

  const saveShopChanges = () => {
    if (currentShop) {
      try {
        shopService.saveShop({ ...currentShop, updatedAt: Date.now() });
        setShops(shopService.getShopsForUser(user!.id));
        alert('Shop published successfully!');
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const deleteShop = (id: string) => {
    if (confirm('Permanently delete this webshop? This action cannot be undone.')) {
      shopService.deleteShop(id);
      setShops(shopService.getShopsForUser(user!.id));
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
      alert("AI generation failed. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulated "Visit Site"
  const openLiveSite = (slug: string) => {
    const url = `${window.location.origin}${window.location.pathname}?shop=${slug}`;
    window.open(url, '_blank');
  };

  if (view === 'live' && currentShop) {
    return (
      <div className="fixed inset-0 bg-white">
        <SandboxedPreview 
          html={currentShop.html} 
          css={currentShop.css} 
          js={currentShop.js} 
          className="border-none rounded-none"
        />
      </div>
    );
  }

  const Navbar = () => (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
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
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                    {user.name[0].toUpperCase()}
                  </div>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => setView('login')} className="text-slate-600 hover:text-slate-900 text-sm font-medium">Log In</button>
                <button onClick={() => setView('signup')} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  Get Started
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {view === 'landing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-8 animate-bounce">
                <Sparkles size={16} /> AI-Powered Shop Generation Now Available
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Launch your business <br />
                <span className="text-blue-600">in 60 seconds.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                No hosting. No deployment. No nonsense. Simply paste your frontend code or generate a template with AI, and your shop is live instantly on our global network.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setView('signup')}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-xl shadow-slate-200"
                >
                  Create Your Free Shop <ArrowLeft className="rotate-180" size={20} />
                </button>
                <button 
                  onClick={() => setView('blueprint')}
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition"
                >
                  How it Works
                </button>
              </div>
            </div>
            
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Monitor, title: "Zero Hosting", desc: "No need to worry about servers. We host your frontend code in a highly optimized, sandboxed environment.", color: "bg-blue-100 text-blue-600" },
                { icon: Globe, title: "Unique URLs", desc: "Every shop gets a unique subdomain or slug. Share your link and start selling immediately.", color: "bg-green-100 text-green-600" },
                { icon: Lock, title: "Secure by Design", desc: "Our platform uses strict iframe sandboxing and Content Security Policies to protect you and your users.", color: "bg-purple-100 text-purple-600" }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <div className="max-w-md mx-auto py-20 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-slate-500 mt-2">The fastest way to launch your webshop.</p>
              </div>
              <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
                {view === 'signup' && (
                  <div>
                    <label className="text-sm font-bold text-slate-600 block mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-slate-600 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="name@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition mt-4">
                  {view === 'login' ? 'Log In' : 'Sign Up Free'}
                </button>
              </form>
              <div className="mt-6 text-center text-sm">
                {view === 'login' ? (
                  <p>No account? <button onClick={() => setView('signup')} className="text-blue-600 font-bold">Sign up</button></p>
                ) : (
                  <p>Already have an account? <button onClick={() => setView('login')} className="text-blue-600 font-bold">Log in</button></p>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Your Ecosystem</h2>
                <p className="text-slate-500 mt-1">Hello {user?.name}, you have {shops.length} active storefronts.</p>
              </div>
              <button 
                onClick={createNewShop}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-100"
              >
                <Plus size={20} /> Create New Shop
              </button>
            </div>

            {shops.length === 0 ? (
              <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layout className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Ready to go live?</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">Click the button above to launch your first shop slug and start selling.</p>
                <button onClick={createNewShop} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition">
                  Create Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shops.map(shop => (
                  <div key={shop.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Online
                      </span>
                    </div>
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Globe size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{shop.name}</h3>
                      <p className="text-slate-400 text-sm font-mono truncate">{shop.slug}.shopinsta.com</p>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setCurrentShop({ ...shop }); setView('editor'); }}
                          className="flex-1 bg-slate-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
                        >
                          <Code2 size={16} /> Edit Code
                        </button>
                        <button 
                          onClick={() => openLiveSite(shop.slug)}
                          className="bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl hover:bg-slate-200 transition"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                      <button 
                        onClick={() => deleteShop(shop.id)}
                        className="w-full text-slate-400 hover:text-red-500 text-xs font-medium transition flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} /> Delete Storefront
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
            {/* Editor Sidebar */}
            <div className="w-full md:w-1/2 flex flex-col border-r border-slate-800 bg-slate-800">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-white transition">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex flex-col">
                    <input 
                      value={currentShop.name}
                      onChange={(e) => setCurrentShop({...currentShop, name: e.target.value})}
                      className="bg-transparent text-white font-bold text-base border-none focus:ring-0 w-48 placeholder:text-slate-600"
                      placeholder="Shop Name"
                    />
                    <div className="flex items-center gap-1">
                       <span className="text-[10px] text-slate-500 font-mono">/shop/</span>
                       <input 
                        value={currentShop.slug}
                        onChange={(e) => setCurrentShop({...currentShop, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                        className="bg-transparent text-blue-400 text-[10px] border-none focus:ring-0 p-0 font-mono w-32"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-900/20"
                  >
                    <Sparkles size={16} /> {isGenerating ? 'AI Logic...' : 'AI Remix'}
                  </button>
                  <button 
                    onClick={saveShopChanges}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-900/20"
                  >
                    <Save size={16} /> Publish
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-3 flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 border-b border-slate-800">
                   <div className="text-blue-400 border-b-2 border-blue-400 pb-1 cursor-pointer">bundle.js</div>
                   <div className="hover:text-slate-300 cursor-not-allowed transition">assets.json</div>
                   <div className="hover:text-slate-300 cursor-not-allowed transition">config.yml</div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><Layout size={12} /> HTML Structure</label>
                      <button className="text-[10px] text-slate-500 hover:text-white transition">Beautify</button>
                    </div>
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-blue-100 font-mono text-sm p-4 rounded-xl border border-slate-700 focus:border-blue-500 outline-none resize-none transition-colors"
                      value={currentShop.html}
                      onChange={(e) => setCurrentShop({...currentShop, html: e.target.value})}
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 flex items-center gap-1.5"><Settings size={12} /> CSS Styles</label>
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-pink-100 font-mono text-sm p-4 rounded-xl border border-slate-700 focus:border-pink-500 outline-none resize-none transition-colors"
                      value={currentShop.css}
                      onChange={(e) => setCurrentShop({...currentShop, css: e.target.value})}
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 flex items-center gap-1.5"><Code2 size={12} /> JavaScript Bundle</label>
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-yellow-100 font-mono text-sm p-4 rounded-xl border border-slate-700 focus:border-yellow-500 outline-none resize-none transition-colors"
                      value={currentShop.js}
                      onChange={(e) => setCurrentShop({...currentShop, js: e.target.value})}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-100 overflow-hidden relative">
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">Simulated Edge Render</span>
                  </div>
                  <button 
                    onClick={() => openLiveSite(currentShop.slug)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Open Full View <ExternalLink size={12} />
                  </button>
               </div>
               
               <div className="flex-1 p-8 flex flex-col">
                  {/* Browser Mock */}
                  <div className="bg-slate-200 rounded-t-2xl h-10 flex items-center px-4 gap-2 shrink-0 border-x border-t border-slate-300">
                    <div className="flex gap-1.5 mr-4">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    </div>
                    <div className="bg-white rounded-lg h-6 flex-1 px-4 flex items-center shadow-sm">
                      <Lock size={10} className="text-slate-400 mr-2" />
                      <span className="text-[10px] text-slate-500 font-mono truncate tracking-tight">https://{currentShop.slug}.shopinsta.com/store</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border-x border-b border-slate-300 rounded-b-2xl shadow-2xl overflow-hidden relative">
                    <SandboxedPreview 
                      html={currentShop.html} 
                      css={currentShop.css} 
                      js={currentShop.js} 
                      className="border-none rounded-none"
                    />
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'blueprint' && <Blueprint />}
      </main>

      {view !== 'editor' && (
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-600 w-6 h-6" />
                <span className="text-slate-900 font-bold text-xl">{APP_NAME}</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs text-center md:text-left">
                Empowering merchants worldwide with instant hosting and AI-driven storefront design.
              </p>
            </div>
            <div className="flex gap-12 text-sm text-slate-500 font-semibold uppercase tracking-wider">
              <div className="flex flex-col gap-3">
                <span className="text-slate-900 mb-2">Platform</span>
                <button onClick={() => setView('blueprint')} className="hover:text-blue-600 text-left">Architecture</button>
                <a href="#" className="hover:text-blue-600">Templates</a>
                <a href="#" className="hover:text-blue-600">Pricing</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-slate-900 mb-2">Company</span>
                <a href="#" className="hover:text-blue-600">Privacy</a>
                <a href="#" className="hover:text-blue-600">Terms</a>
                <a href="#" className="hover:text-blue-600">Support</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span>© 2024 Instant Webshop Platform Inc.</span>
            <span>All Systems Operational</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
