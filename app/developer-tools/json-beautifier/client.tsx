'use client';
import { useState } from 'react';
import { Copy, Trash2, Check, Download, AlertCircle } from 'lucide-react';

export default function JsonBeautifierClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      <div className="flex flex-col bg-card border rounded-2xl shadow-sm overflow-hidden h-full">
        <div className="p-3 border-b bg-muted/30 flex justify-between items-center shrink-0">
          <span className="font-semibold text-sm">Input JSON</span>
          <div className="flex gap-2">
            <button 
              onClick={() => { setInput(''); setOutput(''); setError(''); }}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={formatJson}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Format
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here... e.g. {"name":"John", "age":30}'
          className="w-full flex-grow p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm bg-transparent"
        />
      </div>

      <div className="flex flex-col bg-card border rounded-2xl shadow-sm overflow-hidden h-full relative">
        <div className="p-3 border-b bg-muted/30 flex justify-between items-center shrink-0">
          <span className="font-semibold text-sm">Output</span>
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              disabled={!output}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md disabled:opacity-50"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md disabled:opacity-50"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {error ? (
          <div className="p-4 m-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-start gap-2 text-sm font-mono break-all overflow-auto">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full flex-grow p-4 resize-none focus:outline-none font-mono text-sm bg-muted/10 text-foreground"
          />
        )}
      </div>
    </div>
  );
}
