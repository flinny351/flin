
import React, { useMemo } from 'react';

interface SandboxedPreviewProps {
  html: string;
  css: string;
  js: string;
  className?: string;
}

const SandboxedPreview: React.FC<SandboxedPreviewProps> = ({ html, css, js, className = "" }) => {
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  }, [html, css, js]);

  return (
    <div className={`w-full h-full bg-white rounded-lg shadow-inner overflow-hidden border border-slate-200 ${className}`}>
      <iframe
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default SandboxedPreview;
