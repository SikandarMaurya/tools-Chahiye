'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, Download, Trash2, Loader2, Unlock,
  ShieldAlert, Lock, ShieldCheck, CheckCircle2, FileOutput, Key, X, AlertCircle
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type FileItem = {
  id: string;
  file: File;
  bytes: Uint8Array | null;
  status: 'idle' | 'analyzing' | 'locked' | 'unlocked' | 'processing' | 'done' | 'error';
  isLocked: boolean;
  needsPassword: boolean;
  password?: string;
  errorMsg?: string;
  resultUrl?: string;
};

export default function UnlockPdfClient() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [activePasswordPrompt, setActivePasswordPrompt] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (uploadedFiles: FileList | File[]) => {
    const newItems: FileItem[] = Array.from(uploadedFiles)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        bytes: null,
        status: 'analyzing',
        isLocked: false,
        needsPassword: false
      }));

    if (newItems.length === 0) return;

    setFiles(prev => [...prev, ...newItems]);
    setStatus('idle');

    for (const item of newItems) {
      try {
        const arrayBuffer = await item.file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, bytes: uint8Array } : f));
        await analyzePdf(item.id, uint8Array);
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === item.id ? {
          ...f,
          status: 'error',
          errorMsg: err.message || 'Failed to read PDF'
        } : f));
      }
    }
  };

  const analyzePdf = async (id: string, bytes: Uint8Array, pwd?: string) => {
    try {
      const info = await isEncrypted(bytes);
      if (!info.encrypted) {
        setFiles(prev => prev.map(f => f.id === id ? {
          ...f,
          status: 'unlocked',
          isLocked: false,
          needsPassword: false,
          password: '',
          errorMsg: undefined
        } : f));
        return;
      }
      
      try {
        // Try to decrypt
        await decryptPDF(bytes, pwd || '');
        
        setFiles(prev => prev.map(f => f.id === id ? {
          ...f,
          status: 'unlocked',
          isLocked: true,
          needsPassword: false,
          password: pwd || '',
          errorMsg: undefined
        } : f));
        
        if (activePasswordPrompt === id) {
          setActivePasswordPrompt(null);
          setPasswordInput('');
        }
      } catch (err: any) {
        if (err.message && err.message.includes('Incorrect password')) {
          // Needs password
          setFiles(prev => prev.map(f => f.id === id ? {
            ...f,
            status: 'locked',
            isLocked: true,
            needsPassword: true,
            errorMsg: pwd ? 'Incorrect password' : 'Password required'
          } : f));
          if (!activePasswordPrompt) {
            setActivePasswordPrompt(id);
            setPasswordInput('');
          }
        } else {
          throw err; // throw to outer catch
        }
      }
    } catch (err: any) {
      // Some other error
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'error',
        errorMsg: err.message || 'Failed to read PDF'
      } : f));
    }
  };

  const submitPassword = () => {
    if (!activePasswordPrompt || !passwordInput) return;
    const file = files.find(f => f.id === activePasswordPrompt);
    if (file && file.bytes) {
       analyzePdf(file.id, file.bytes, passwordInput);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl);
      return prev.filter(f => f.id !== id);
    });
    if (activePasswordPrompt === id) {
      setActivePasswordPrompt(null);
      setPasswordInput('');
    }
  };

  const handleUnlock = async () => {
    if (files.length === 0) return;
    
    // Check if any files still need passwords
    const stillLocked = files.filter(f => f.needsPassword);
    if (stillLocked.length > 0) {
      setActivePasswordPrompt(stillLocked[0].id);
      return;
    }

    setStatus('processing');
    
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status !== 'unlocked' || !item.bytes) continue;
      
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing' } : f));
      
      try {
        let pdfBytes = item.bytes;
        if (item.isLocked) {
          pdfBytes = await decryptPDF(item.bytes, item.password || '');
        }
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);
        
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', resultUrl } : f));
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', errorMsg: err.message } : f));
      }
    }
    
    setStatus('done');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {files.length === 0 ? (
        <div className="max-w-3xl mx-auto">
          <div 
            className="border-2 border-dashed rounded-2xl p-16 text-center transition-all border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              accept=".pdf,application/pdf" 
              multiple
              className="hidden" 
            />
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Unlock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Unlock PDF Files</h3>
              <p className="text-muted-foreground mb-8 text-sm md:text-base">
                Remove passwords and restrictions to edit, copy, and print your PDFs freely.
              </p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                Select PDF Files
              </button>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <ShieldAlert className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Remove Restrictions</h4>
              <p className="text-sm text-muted-foreground">Strip copy, edit, and print limitations from your PDF instantly.</p>
            </div>
            <div className="p-4">
              <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Bypass Passwords</h4>
              <p className="text-sm text-muted-foreground">Remove the open password permanently (requires original password).</p>
            </div>
            <div className="p-4">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Files are processed in your browser. Nothing is uploaded.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto">
          <div className="p-4 border-b flex justify-between items-center bg-muted/30">
            <h3 className="font-semibold text-lg flex items-center">
              Files to Unlock <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{files.length}</span>
            </h3>
            <div className="flex gap-2">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="text-sm font-medium px-3 py-1.5 border rounded-lg hover:bg-muted transition-colors flex items-center"
               >
                 <UploadCloud className="w-4 h-4 mr-2" /> Add More
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  accept=".pdf,application/pdf" 
                  multiple
                  className="hidden" 
               />
               <button 
                 onClick={() => {
                   setFiles([]);
                   setActivePasswordPrompt(null);
                   setIsAuthorized(false);
                   setStatus('idle');
                 }}
                 className="text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center"
               >
                 Clear All
               </button>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar space-y-3">
             {files.map(file => (
               <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg bg-background relative overflow-hidden">
                 
                 {/* Password Overlay */}
                 {activePasswordPrompt === file.id && (
                   <div className="absolute inset-0 z-10 bg-background/95 backdrop-blur flex items-center px-4 border-l-4 border-primary">
                     <Key className="w-5 h-5 text-primary mr-3" />
                     <div className="flex-1">
                       <h4 className="font-medium text-sm">Enter Password</h4>
                       <p className="text-xs text-muted-foreground">This file is protected by an open password.</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <input 
                         type="password"
                         value={passwordInput}
                         onChange={(e) => setPasswordInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && submitPassword()}
                         placeholder="Password"
                         className="bg-background border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
                         autoFocus
                       />
                       <button 
                         onClick={submitPassword}
                         className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90"
                       >
                         Unlock
                       </button>
                       <button 
                         onClick={() => setActivePasswordPrompt(null)}
                         className="p-1.5 text-muted-foreground hover:bg-muted rounded"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 )}

                 <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${
                   file.status === 'locked' ? 'bg-orange-100 text-orange-600' :
                   file.status === 'unlocked' && file.isLocked ? 'bg-green-100 text-green-600' :
                   file.status === 'done' ? 'bg-green-100 text-green-600' :
                   'bg-muted text-muted-foreground'
                 }`}>
                   {file.status === 'analyzing' || file.status === 'processing' ? <Loader2 className="w-6 h-6 animate-spin" /> :
                    file.status === 'locked' ? <Lock className="w-6 h-6" /> :
                    file.status === 'done' ? <CheckCircle2 className="w-6 h-6" /> :
                    <Unlock className="w-6 h-6" />}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <h4 className="font-medium text-sm truncate" title={file.file.name}>{file.file.name}</h4>
                   <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                     <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                     
                     {file.status === 'error' && (
                       <><span>•</span><span className="text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {file.errorMsg}</span></>
                     )}
                     {file.status === 'locked' && (
                       <><span>•</span><span className="text-orange-500 flex items-center cursor-pointer hover:underline" onClick={() => setActivePasswordPrompt(file.id)}>Requires Password</span></>
                     )}
                     {file.status === 'unlocked' && file.isLocked && (
                       <><span>•</span><span className="text-green-600 flex items-center"><Unlock className="w-3 h-3 mr-1"/> Ready to remove password and restore permissions</span></>
                     )}
                     {file.status === 'unlocked' && !file.isLocked && (
                       <><span>•</span><span className="text-green-600 flex items-center"><Unlock className="w-3 h-3 mr-1"/> No open password detected. Ready to remove owner restrictions</span></>
                     )}
                     {file.status === 'processing' && (
                       <><span>•</span><span className="text-primary flex items-center">Removing protection...</span></>
                     )}
                     {file.status === 'done' && (
                       <><span>•</span><span className="text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Unlocked completely</span></>
                     )}
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   {file.status === 'locked' && (
                     <button 
                       onClick={() => setActivePasswordPrompt(file.id)}
                       className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 rounded font-medium transition-colors"
                     >
                       Enter Password
                     </button>
                   )}
                   {file.status === 'done' && file.resultUrl ? (
                     <a 
                       href={file.resultUrl}
                       download={`unlocked_${file.file.name}`}
                       className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center"
                     >
                       <Download className="w-4 h-4 mr-2" /> Download
                     </a>
                   ) : (
                     <button 
                       onClick={() => removeFile(file.id)}
                       disabled={status === 'processing'}
                       className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>

          <div className="p-4 border-t bg-muted/20">
            {status === 'done' ? (
               <div className="text-center">
                  <div className="text-sm font-medium mb-3 flex items-center justify-center text-green-600">
                     <CheckCircle2 className="w-5 h-5 mr-2" />
                     {files.length} {files.length === 1 ? 'file' : 'files'} unlocked successfully
                  </div>
                  <button 
                    onClick={() => {
                      setFiles([]);
                      setIsAuthorized(false);
                      setStatus('idle');
                    }}
                    className="w-full py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 font-medium transition-colors"
                  >
                    Unlock More PDFs
                  </button>
               </div>
            ) : status === 'processing' ? (
               <div className="text-center py-2">
                  <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                  <div className="text-sm font-medium">Removing PDF restrictions...</div>
               </div>
            ) : (
               <div className="space-y-4">
                 {files.length > 0 && !files.some(f => f.needsPassword) && (
                   <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                     <input 
                       type="checkbox"
                       checked={isAuthorized}
                       onChange={(e) => setIsAuthorized(e.target.checked)}
                       className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/50"
                     />
                     <div className="text-sm text-left">
                       <span className="font-semibold block mb-1">Legal & User Authorization</span>
                       <span className="text-muted-foreground text-xs leading-relaxed block">
                         I confirm that I own this PDF or have permission to unlock it, and I have entered the correct password. I understand this tool does not bypass encryption without valid authorization.
                       </span>
                     </div>
                   </label>
                 )}
                 
                 <button 
                   onClick={handleUnlock}
                   disabled={files.length === 0 || files.some(f => f.needsPassword) || files.some(f => f.status === 'analyzing') || (!isAuthorized && !files.some(f => f.needsPassword))}
                   className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                 >
                   <Unlock className="w-4 h-4 mr-2" /> 
                   {files.some(f => f.needsPassword) ? 'Enter Passwords to Continue' : 'Unlock PDF Files'}
                 </button>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
