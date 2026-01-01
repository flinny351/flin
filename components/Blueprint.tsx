
import React from 'react';

const Blueprint: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">High-Level System Architecture</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-3 text-blue-600">Client-Side Isolation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              User-submitted HTML/JS is stored as raw strings in a database. When rendered, it is injected into a 
              <strong> heavily sandboxed iframe</strong>. This ensures script execution cannot access the platform's
              top-level document, cookies, or sensitive localStorage items.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-3 text-blue-600">Distribution Layer</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              In a production environment, a wildcard DNS entry (e.g., *.shopinsta.com) points to a specialized 
              rendering service or CDN edge that fetches the code based on the subdomain slug.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Suggested Tech Stack</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase mt-1">Frontend</span>
            <div>
              <p className="font-medium">React + Next.js (App Router)</p>
              <p className="text-slate-500 text-sm">Next.js middleware provides clean subdomain routing and SSR for SEO-optimized shop pages.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase mt-1">Backend</span>
            <div>
              <p className="font-medium">Supabase / PostgreSQL</p>
              <p className="text-slate-500 text-sm">Postgres for structured shop data. Supabase Auth for simple, secure user management.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase mt-1">Hosting</span>
            <div>
              <p className="font-medium">Vercel / AWS Amplify</p>
              <p className="text-slate-500 text-sm">Built-in support for dynamic subdomains and high-performance edge delivery.</p>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Database Schema</h2>
        <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg text-sm overflow-x-auto">
{`Table: Users
- id (uuid, pk)
- email (string, unique)
- created_at (timestamp)

Table: Webshops
- id (uuid, pk)
- user_id (uuid, fk -> Users.id)
- name (string)
- slug (string, unique, index)
- html_content (text)
- css_content (text)
- js_content (text)
- settings (jsonb) // e.g., metadata, favicon
- created_at (timestamp)`}
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Security Considerations</h2>
        <div className="space-y-4 text-slate-600">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">1</div>
            <p><strong>Strict Content Security Policy (CSP):</strong> Headers should restrict script execution to the iframe's origin and prevent framing of the main platform.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">2</div>
            <p><strong>Input Sanitization:</strong> While we want to allow JS, we must sanitize inputs for known dangerous patterns or server-side injection if any backend processing is done.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">3</div>
            <p><strong>Same-Origin Isolation:</strong> Ensuring `sandbox="allow-same-origin"` is NOT used unless absolutely necessary, preventing shops from accessing the parent's sensitive data.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Monetization Strategies</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-slate-200 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Freemium</h4>
            <p className="text-sm text-slate-500">1 shop for free with ShopInsta branding. Paid plans for more shops.</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Custom Domains</h4>
            <p className="text-sm text-slate-500">Premium feature to connect own .com domains instead of subdomains.</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Shop Templates</h4>
            <p className="text-sm text-slate-500">A marketplace for high-conversion frontend shop templates created by designers.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blueprint;
