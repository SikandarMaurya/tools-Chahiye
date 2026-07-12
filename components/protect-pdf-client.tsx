'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, Download, Trash2, Loader2, Shield, ShieldCheck, 
  Key, Lock, Unlock, Settings2, FileOutput, CheckSquare, 
  AlertCircle, Eye, EyeOff, RefreshCw, Copy, Check
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import { encryptPDF } from '@pdfsmaller/pdf-encrypt';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type FileItem = {
  id: string;
  file: File;
  previewUrl: string | null;
  numPages: number;
  status: 'idle' | 'analyzing' | 'ready' | 'processing' | 'done' | 'error';
  errorMsg?: string;
  resultUrl?: string;
};

type SecurityProfile = 'custom' | 'private' | 'office' | 'legal' | 'readonly';

type Config = {
  profile: SecurityProfile;
  openPassword: '';
  requireOpenPassword: boolean;
  ownerPassword: '';
  requireOwnerPassword: boolean;
  encryptionLevel: 'aes-128' | 'aes-256';
  permissions: {
    print: 'none' | 'low' | 'high';
    edit: 'none' | 'assembly' | 'form-fill' | 'any';
    copy: boolean;
    annotate: boolean;
  }
};

const DEFAULT_CONFIG: Config = {
  profile: 'custom',
  openPassword: '',
  requireOpenPassword: true,
  ownerPassword: '',
  requireOwnerPassword: false,
  encryptionLevel: 'aes-256',
  permissions: {
    print: 'high',
    edit: 'any',
    copy: true,
    annotate: true,
  }
};

export default function ProtectPdfClient() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [showOpenPassword, setShowOpenPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (uploadedFiles: FileList | File[]) => {
    const newItems: FileItem[] = Array.from(uploadedFiles)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        previewUrl: null,
        numPages: 0,
        status: 'analyzing'
      }));

    if (newItems.length === 0) return;

    setFiles(prev => [...prev, ...newItems]);
    setStatus('idle');

    for (const item of newItems) {
      try {
        const arrayBuffer = await item.file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array.slice(0) });
        const pdf = await loadingTask.promise;
        
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
        }
        
        setFiles(prev => prev.map(f => f.id === item.id ? {
          ...f,
          numPages: pdf.numPages,
          previewUrl: canvas.toDataURL('image/jpeg', 0.8),
          status: 'ready'
        } : f));
        
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === item.id ? {
          ...f,
          status: 'error',
          errorMsg: err.message || 'Failed to read PDF'
        } : f));
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const checkPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-muted' };
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score < 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const applyProfile = (profile: SecurityProfile) => {
    let newConfig = { ...config, profile };
    switch (profile) {
      case 'private':
        newConfig.requireOpenPassword = true;
        newConfig.requireOwnerPassword = false;
        newConfig.encryptionLevel = 'aes-256';
        break;
      case 'office':
        newConfig.requireOpenPassword = false;
        newConfig.requireOwnerPassword = true;
        newConfig.permissions = { print: 'high', edit: 'form-fill', copy: true, annotate: true };
        break;
      case 'readonly':
        newConfig.requireOpenPassword = false;
        newConfig.requireOwnerPassword = true;
        newConfig.permissions = { print: 'none', edit: 'none', copy: false, annotate: false };
        break;
      case 'legal':
        newConfig.requireOpenPassword = true;
        newConfig.requireOwnerPassword = true;
        newConfig.encryptionLevel = 'aes-256';
        newConfig.permissions = { print: 'none', edit: 'none', copy: false, annotate: false };
        break;
    }
    setConfig(newConfig);
  };

  const handleProtect = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status !== 'ready') continue;
      
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing' } : f));
      
      try {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        
        const options: any = {
          algorithm: config.encryptionLevel === 'aes-128' ? 'RC4' : 'AES-256',
        };
        
        if (config.requireOwnerPassword && config.ownerPassword) {
          options.ownerPassword = config.ownerPassword;
          options.allowPrinting = config.permissions.print !== 'none';
          options.allowHighQualityPrint = config.permissions.print === 'high';
          options.allowModifying = config.permissions.edit === 'any';
          options.allowCopying = config.permissions.copy;
          options.allowAnnotating = config.permissions.annotate;
          options.allowFillingForms = config.permissions.edit === 'any' || config.permissions.edit === 'forms';
          options.allowExtraction = config.permissions.copy;
          options.allowAssembly = config.permissions.edit === 'any';
        }
        
        const encrypted = await encryptPDF(pdfBytes, config.requireOpenPassword ? config.openPassword : '', options);
        
        const blob = new Blob([encrypted], { type: 'application/pdf' });
        const resultUrl = URL.createObjectURL(blob);
        
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', resultUrl } : f));
      } catch (err: any) {
        console.error("Encryption error:", err);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', errorMsg: err.message || 'Encryption failed' } : f));
      }
    }
    
    setStatus('done');
  };

  const openPwdStrength = checkPasswordStrength(config.openPassword);
  const ownerPwdStrength = checkPasswordStrength(config.ownerPassword);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Secure PDF Files</h3>
              <p className="text-muted-foreground mb-8 text-sm md:text-base">
                Drag & Drop PDFs to encrypt with password and manage permissions
              </p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                Select PDF Files
              </button>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">AES-256 Encryption</h4>
              <p className="text-sm text-muted-foreground">Military-grade encryption protects your files from unauthorized access.</p>
            </div>
            <div className="p-4">
              <Key className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Permission Controls</h4>
              <p className="text-sm text-muted-foreground">Restrict printing, copying, and editing with owner passwords.</p>
            </div>
            <div className="p-4">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Your files are processed securely. No passwords are ever saved.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Files List */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
             <div className="bg-card border rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                  <h3 className="font-semibold text-lg flex items-center">
                    Files to Protect <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{files.length}</span>
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
                       onClick={() => setFiles([])}
                       className="text-sm text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center"
                     >
                       Clear All
                     </button>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-3">
                   {files.map(file => (
                     <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg bg-background hover:border-primary/30 transition-colors">
                       <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0 border flex items-center justify-center relative">
                         {file.previewUrl ? (
                           <img src={file.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                         ) : (
                           <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                         )}
                         {file.status === 'done' && (
                           <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                             <div className="bg-green-500 text-white rounded-full p-1 shadow">
                               <Check className="w-4 h-4" />
                             </div>
                           </div>
                         )}
                       </div>
                       
                       <div className="flex-1 min-w-0">
                         <h4 className="font-medium text-sm truncate" title={file.file.name}>{file.file.name}</h4>
                         <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                           <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                           <span>•</span>
                           <span>{file.numPages || '?'} Pages</span>
                           {file.status === 'error' && (
                             <span className="text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {file.errorMsg}</span>
                           )}
                           {file.status === 'processing' && (
                             <span className="text-primary flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Processing</span>
                           )}
                           {file.status === 'done' && (
                             <span className="text-green-600 flex items-center"><ShieldCheck className="w-3 h-3 mr-1"/> Secured</span>
                           )}
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         {file.status === 'done' && file.resultUrl ? (
                           <a 
                             href={file.resultUrl}
                             download={`protected_${file.file.name}`}
                             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                             title="Download Secured PDF"
                           >
                             <Download className="w-5 h-5" />
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
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
             <div className="bg-card border rounded-xl p-5 shadow-sm sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col">
                <div className="flex items-center mb-5">
                  <Settings2 className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="font-semibold text-lg">Security Settings</h3>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Quick Profiles</label>
                  <select 
                    value={config.profile}
                    onChange={(e) => applyProfile(e.target.value as SecurityProfile)}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="custom">Custom Settings</option>
                    <option value="private">Private (Open Password Only)</option>
                    <option value="readonly">Read-Only (No Edit/Print/Copy)</option>
                    <option value="office">Office (Allow Print/Form-Fill)</option>
                    <option value="legal">Legal (Maximum Restriction)</option>
                  </select>
                </div>

                {/* Open Password */}
                <div className="p-4 border rounded-lg mb-4 bg-muted/20">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input 
                        type="checkbox"
                        checked={config.requireOpenPassword}
                        onChange={(e) => setConfig({...config, requireOpenPassword: e.target.checked, profile: 'custom'})}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Require password to open</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Users must enter this to view the PDF.</div>
                    </div>
                  </label>
                  
                  {config.requireOpenPassword && (
                    <div className="mt-4 pl-7">
                      <div className="relative">
                        <input 
                          type={showOpenPassword ? "text" : "password"}
                          value={config.openPassword}
                          onChange={(e) => setConfig({...config, openPassword: e.target.value as any})}
                          placeholder="Enter open password"
                          className="w-full bg-background border rounded-lg pl-3 pr-20 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="absolute right-2 top-1.5 flex items-center gap-1">
                          <button onClick={() => setShowOpenPassword(!showOpenPassword)} className="p-1 text-muted-foreground hover:text-foreground">
                            {showOpenPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                          </button>
                          <button onClick={() => setConfig({...config, openPassword: generatePassword() as any})} className="p-1 text-muted-foreground hover:text-foreground" title="Generate Password">
                            <RefreshCw className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${openPwdStrength.color} transition-all duration-300`} style={{ width: `${(openPwdStrength.score / 5) * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">{openPwdStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Owner Password */}
                <div className="p-4 border rounded-lg mb-4 bg-muted/20">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input 
                        type="checkbox"
                        checked={config.requireOwnerPassword}
                        onChange={(e) => setConfig({...config, requireOwnerPassword: e.target.checked, profile: 'custom'})}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Restrict permissions (Owner Password)</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Prevent printing, editing, or copying.</div>
                    </div>
                  </label>
                  
                  {config.requireOwnerPassword && (
                    <div className="mt-4 pl-7">
                      <div className="relative mb-4">
                        <input 
                          type={showOwnerPassword ? "text" : "password"}
                          value={config.ownerPassword}
                          onChange={(e) => setConfig({...config, ownerPassword: e.target.value as any})}
                          placeholder="Enter owner password"
                          className="w-full bg-background border rounded-lg pl-3 pr-20 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="absolute right-2 top-1.5 flex items-center gap-1">
                          <button onClick={() => setShowOwnerPassword(!showOwnerPassword)} className="p-1 text-muted-foreground hover:text-foreground">
                            {showOwnerPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                          </button>
                          <button onClick={() => setConfig({...config, ownerPassword: generatePassword() as any})} className="p-1 text-muted-foreground hover:text-foreground" title="Generate Password">
                            <RefreshCw className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3 bg-background p-3 rounded border text-sm">
                        <div className="font-medium mb-2 border-b pb-2 text-xs uppercase text-muted-foreground tracking-wider">Allowed Actions</div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-medium mb-1.5">Printing</label>
                             <select 
                               value={config.permissions.print}
                               onChange={(e) => setConfig({...config, profile: 'custom', permissions: {...config.permissions, print: e.target.value as any}})}
                               className="w-full bg-muted border-none rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary/50"
                             >
                               <option value="none">Not Allowed</option>
                               <option value="low">Low Quality</option>
                               <option value="high">High Quality</option>
                             </select>
                           </div>
                           
                           <div>
                             <label className="block text-xs font-medium mb-1.5">Editing</label>
                             <select 
                               value={config.permissions.edit}
                               onChange={(e) => setConfig({...config, profile: 'custom', permissions: {...config.permissions, edit: e.target.value as any}})}
                               className="w-full bg-muted border-none rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary/50"
                             >
                               <option value="none">Not Allowed</option>
                               <option value="assembly">Document Assembly</option>
                               <option value="form-fill">Form Filling</option>
                               <option value="any">Any Editing</option>
                             </select>
                           </div>
                        </div>

                        <div className="flex gap-4 pt-1">
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input 
                               type="checkbox"
                               checked={config.permissions.copy}
                               onChange={(e) => setConfig({...config, profile: 'custom', permissions: {...config.permissions, copy: e.target.checked}})}
                               className="w-3.5 h-3.5 rounded text-primary"
                             />
                             <span className="text-xs">Copy Text/Images</span>
                           </label>
                           
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input 
                               type="checkbox"
                               checked={config.permissions.annotate}
                               onChange={(e) => setConfig({...config, profile: 'custom', permissions: {...config.permissions, annotate: e.target.checked}})}
                               className="w-3.5 h-3.5 rounded text-primary"
                             />
                             <span className="text-xs">Annotations</span>
                           </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Encryption Level */}
                <div className="mb-6 flex gap-4">
                   <div className="flex-1">
                     <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Encryption Level</label>
                     <div className="flex bg-muted p-1 rounded-lg">
                       <button 
                         onClick={() => setConfig({...config, encryptionLevel: 'aes-128'})}
                         className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${config.encryptionLevel === 'aes-128' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                       >
                         AES-128
                       </button>
                       <button 
                         onClick={() => setConfig({...config, encryptionLevel: 'aes-256'})}
                         className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${config.encryptionLevel === 'aes-256' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                       >
                         AES-256
                       </button>
                     </div>
                   </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  {status === 'done' ? (
                     <div className="text-center">
                        <div className="text-sm font-medium mb-3 flex items-center justify-center text-green-600">
                           <CheckSquare className="w-5 h-5 mr-2" />
                           {files.length} {files.length === 1 ? 'file' : 'files'} protected successfully
                        </div>
                        <button 
                          onClick={() => setStatus('idle')}
                          className="w-full py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 font-medium transition-colors"
                        >
                          Modify Settings
                        </button>
                     </div>
                  ) : status === 'processing' ? (
                     <div className="text-center py-2">
                        <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                        <div className="text-sm font-medium">Securing PDFs...</div>
                     </div>
                  ) : (
                     <button 
                       onClick={handleProtect}
                       disabled={(!config.requireOpenPassword && !config.requireOwnerPassword) || 
                                 (config.requireOpenPassword && !config.openPassword) || 
                                 (config.requireOwnerPassword && !config.ownerPassword) || 
                                 files.length === 0}
                       className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                     >
                       <Shield className="w-4 h-4 mr-2" /> Protect PDF
                     </button>
                  )}
                  {status === 'idle' && (!config.requireOpenPassword && !config.requireOwnerPassword) && (
                     <div className="text-xs text-orange-500 mt-2 text-center flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Enable open or owner password to protect.
                     </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
