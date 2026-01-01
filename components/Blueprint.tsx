
import React from 'react';

const Blueprint: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Hosting Logic & Subdomains</h2>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <p className="text-slate-600 mb-4">
            To achieve <strong>shopname.platform.com</strong> style hosting in production:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 text-sm">
            <li><strong>Wildcard DNS:</strong> Configure a CNAME record for <code>*.platform.com</code> to point to your main application server.</li>
            <li><strong>Reverse Proxy / Middleware:</strong> In a Next.js environment, use <code>middleware.ts</code> to extract the hostname from the request.</li>
            <li><strong>Rewrite:</strong> Map the hostname to a internal path like <code>/shops/[slug]</code>.</li>
            <li><strong>Isolation:</strong> The rendered page contains ONLY the iframe, with no platform scripts or cookies shared.</li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Database Schema</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-2">Table: Users</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Constraint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="px-4 py-2">id</td><td className="px-4 py-2">UUID</td><td className="px-4 py-2">Primary Key</td></tr>
              <tr><td className="px-4 py-2">email</td><td className="px-4 py-2">VARCHAR(255)</td><td className="px-4 py-2">Unique, Not Null</td></tr>
              <tr><td className="px-4 py-2">password_hash</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Not Null</td></tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-2">Table: Webshops</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Constraint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="px-4 py-2">id</td><td className="px-4 py-2">UUID</td><td className="px-4 py-2">Primary Key</td></tr>
              <tr><td className="px-4 py-2">user_id</td><td className="px-4 py-2">UUID</td><td className="px-4 py-2">Foreign Key (Users)</td></tr>
              <tr><td className="px-4 py-2">slug</td><td className="px-4 py-2">VARCHAR(100)</td><td className="px-4 py-2">Unique, Indexed</td></tr>
              <tr><td className="px-4 py-2">html_content</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2"></td></tr>
              <tr><td className="px-4 py-2">status</td><td className="px-4 py-2">VARCHAR(20)</td><td className="px-4 py-2">Default 'online'</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">Security Implementation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">Sandbox Attributes</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              We use <code>sandbox="allow-scripts"</code>. Crucially, we omit <code>allow-same-origin</code>. 
              This prevents the user shop from accessing the parent's localStorage, Cookies, or the DOM.
            </p>
          </div>
          <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">CSP Headers</h4>
            <p className="text-xs text-green-700 leading-relaxed">
              In production, the hosting page should send a <code>Content-Security-Policy</code> header that 
              disallows framing from other domains (<code>frame-ancestors 'none'</code>) and 
              restricts where scripts can connect.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blueprint;
