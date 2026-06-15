import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Upload, Hexagon, Book, Box, Code2, Play, Activity } from 'lucide-react';
import { usePDFViewer, PDFToolbar, PDFDocumentView } from './index';
import './App.css';

type LogEntry = {
  id: string;
  timestamp: string;
  type: 'ACTION' | 'STATE' | 'SYSTEM';
  payload: string;
};

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'usage' | 'apis' | 'logs'>('usage');

  const pushLog = (type: LogEntry['type'], payload: string) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      type,
      payload
    }, ...prev].slice(0, 40));
  };

  const pdfState = usePDFViewer(file);
  const prevStateRef = useRef(pdfState);

  // Initial mount log
  useEffect(() => {
    pushLog('SYSTEM', 'App initialized. Waiting for PDF buffer...');
  }, []);

  // State Change Observer
  useEffect(() => {
    const prev = prevStateRef.current;

    if (prev.isLoading !== pdfState.isLoading && !pdfState.isLoading) {
      pushLog('STATE', `STATUS_READY | Buffer attached | Total Pages: ${pdfState.numPages}`);
    }
    if (prev.pageNumber !== pdfState.pageNumber) {
      pushLog('STATE', `PAGE_DID_CHANGE | current: ${pdfState.pageNumber}`);
    }
    if (prev.scale !== pdfState.scale) {
      pushLog('STATE', `SCALE_DID_CHANGE | value: ${pdfState.scale.toFixed(2)}x`);
    }
    if (prev.rotation !== pdfState.rotation) {
      pushLog('STATE', `ROTATION_DID_CHANGE | value: ${pdfState.rotation}°`);
    }

    prevStateRef.current = pdfState;
  }, [pdfState]);

  // Action Interceptors
  const handleZoomIn = () => {
    pushLog('ACTION', 'DISPATCH: zoom_in()');
    pdfState.handleZoomIn();
  };
  const handleZoomOut = () => {
    pushLog('ACTION', 'DISPATCH: zoom_out()');
    pdfState.handleZoomOut();
  };
  const handleRotate = () => {
    pushLog('ACTION', 'DISPATCH: rotate_cw()');
    pdfState.handleRotate();
  };
  const handlePrevPage = () => {
    pushLog('ACTION', 'DISPATCH: prev_page()');
    pdfState.handlePrevPage();
  };
  const handleNextPage = () => {
    pushLog('ACTION', 'DISPATCH: next_page()');
    pdfState.handleNextPage();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      pushLog('SYSTEM', `STREAM_INIT | File: ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`);
      setFile(f);
      setActiveTab('logs'); // auto switch to logs when a file is loaded
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen w-full bg-[#0E1116] text-slate-300 font-sans overflow-hidden">

      {/* LEFT PANEL: Explorer, Docs & Logs */}
      <aside className="w-[420px] flex flex-col border-r border-white/5 bg-[#13161D] shrink-0 z-20 shadow-2xl overflow-hidden">
        <div className="h-14 flex items-center px-4 border-b border-white/5 shrink-0 bg-[#0E1116] justify-between">
          <div className="flex items-center">
            <Hexagon className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="font-semibold text-slate-100 tracking-tight">React PDF Suite</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-mono tracking-widest uppercase">v1.2.0</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-white/5 bg-[#0E1116] shrink-0">
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'usage' ? 'text-indigo-400 border-indigo-400 bg-white/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            <Book className="w-3.5 h-3.5" /> Guide
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'apis' ? 'text-indigo-400 border-indigo-400 bg-white/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            <Box className="w-3.5 h-3.5" /> APIs
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'logs' ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            <Activity className="w-3.5 h-3.5" /> Logs
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {activeTab === 'usage' && (
            <section className="p-5 space-y-8 animate-in fade-in duration-300">
              <div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Designed for headless composition or rapid drop-in. Built on top of <code>react-pdf</code> with zero extraneous styling constraints.
                </p>
                <div className="bg-[#0E1116] rounded-lg border border-white/5 overflow-hidden">
                  <div className="px-3 py-2 text-xs font-mono text-slate-500 bg-[#1A1D24] border-b border-white/5 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" /> Drop-in Example
                  </div>
                  <pre className="p-4 text-[13px] font-mono leading-relaxed overflow-x-auto text-slate-300">
                    <span className="text-pink-500">import</span> {'{'} PDFViewer {'}'} <span className="text-pink-500">from</span> <span className="text-amber-300">'react-pdf-suite'</span>;
                    {'\n\n'}
                    <span className="text-slate-500">{'// Handles internal layout & states'}</span>
                    {'\n'}
                    {'<'}
                    <span className="text-indigo-400">PDFViewer</span> {'\n  '}
                    <span className="text-sky-300">file</span>
                    <span className="text-pink-500">=</span>
                    {'{'}bufferOrUrl{'}'}{'\n  '}
                    <span className="text-sky-300">className</span>
                    <span className="text-pink-500">=</span>
                    <span className="text-amber-300">"h-full w-full"</span>
                    {'\n/>'}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'apis' && (
            <section className="p-5 space-y-4 animate-in fade-in duration-300">
              {/* Type 1 */}
              <div className="bg-[#1A1D24] border border-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono">interface</span>
                  <span className="font-mono text-sm text-slate-200">PDFViewerProps</span>
                </div>
                <ul className="text-xs space-y-2 text-slate-400 font-mono">
                  <li><span className="text-sky-300">file</span>?: File | string | null</li>
                  <li><span className="text-sky-300">className</span>?: string</li>
                </ul>
              </div>

              {/* Type 2 */}
              <div className="bg-[#1A1D24] border border-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">hook</span>
                  <span className="font-mono text-sm text-slate-200">usePDFViewer(file)</span>
                </div>
                <div className="text-xs text-slate-400 mb-2">Returns structural state & dispatches:</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono text-slate-500 bg-[#0E1116] p-2 rounded">
                  <div className="text-indigo-300">numPages</div>
                  <div className="text-indigo-300">pageNumber</div>
                  <div className="text-indigo-300">scale</div>
                  <div className="text-indigo-300">rotation</div>
                  <div className="text-teal-300">handleZoomIn()</div>
                  <div className="text-teal-300">handleZoomOut()</div>
                  <div className="text-teal-300">handleRotate()</div>
                  <div className="text-teal-300">handleNextPage()</div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'logs' && (
            <section className="h-full flex flex-col animate-in fade-in duration-300 bg-[#13161D]">
              {/* State Snapshot */}
              <div className="p-4 border-b border-white/5 bg-[#0E1116]/30 shrink-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Live State Vector</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <pre className="text-[11px] font-mono text-emerald-400/90 leading-relaxed overflow-x-auto">
{JSON.stringify({
  pageNumber: pdfState.pageNumber,
  numPages: pdfState.numPages,
  scale: Number(pdfState.scale.toFixed(2)),
  rotation: pdfState.rotation,
  isLoading: pdfState.isLoading,
}, null, 2)}
                </pre>
              </div>

              {/* Event Stream */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5 min-h-[300px]">
                {logs.map((log) => (
                  <div key={log.id} className={`p-2.5 rounded border text-[11px] font-mono shadow-sm flex flex-col gap-1.5 transition-all
                    ${log.type === 'ACTION' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' :
                      log.type === 'STATE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                      'bg-slate-800/50 border-white/5 text-slate-400'}`}
                  >
                    <div className="flex justify-between items-center opacity-60">
                      <span className="font-bold tracking-wider">{log.type}</span>
                      <span className="tracking-tight">{log.timestamp}</span>
                    </div>
                    <div className="leading-tight break-words">
                      {log.payload}
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center text-xs text-slate-600 font-mono mt-8 italic">Awaiting dispatches...</div>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* CENTER PANEL: Showcase Demo */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Top Header */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-[#0E1116] border-b border-white/5">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-500" />
            <span className="font-medium text-sm text-slate-200">Interactive Setup Demo</span>
          </div>
          <div className="flex items-center gap-3">
             <input type="file" accept=".pdf,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
             <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-200 text-xs font-semibold rounded shadow shadow-white/10 transition-colors flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" /> Inject Source File
              </button>
          </div>
        </header>

        {/* Live Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="absolute inset-0 bg-[#0E1116]/80 backdrop-blur-[2px]"></div>

            {/* The Composed Component fit-to-screen inside the padding */}
            <div className="relative w-full h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 transition-all duration-300">
               {file ? (
                 <>
                   {/* We use our intercepted handlers for the toolbar to log actions */}
                   <PDFToolbar
                     pageNumber={pdfState.pageNumber}
                     numPages={pdfState.numPages}
                     scale={pdfState.scale}
                     isLoading={pdfState.isLoading}
                     onPrevPage={handlePrevPage}
                     onNextPage={handleNextPage}
                     onZoomIn={handleZoomIn}
                     onZoomOut={handleZoomOut}
                     onRotate={handleRotate}
                   />
                   <PDFDocumentView
                     file={file}
                     pageNumber={pdfState.pageNumber}
                     scale={pdfState.scale}
                     rotation={pdfState.rotation}
                     isLoading={pdfState.isLoading}
                     onDocumentLoadSuccess={pdfState.onDocumentLoadSuccess}
                     numPages={pdfState.numPages}
                   />
                 </>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                    <div className="w-20 h-20 bg-slate-100 hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300 text-slate-400 rounded-2xl flex items-center justify-center mb-6 cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Sandbox Empty</h2>
                    <p className="text-slate-500 text-sm max-w-sm text-center mb-6">
                      Inject a PDF source file via the top navigation bar to mount the core components and trigger the lifecycle.
                    </p>
                 </div>
               )}
            </div>
        </div>
      </main>
    </div>
  );
}
