import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { initWorkspaceAuth, googleWorkspaceSignIn, getWorkspaceAccessToken } from "../lib/workspaceAuth";
import { Presentation, Loader2, AlertCircle, FileText, ChevronRight, LogIn } from "lucide-react";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  modifiedTime?: string;
}

export default function GoogleSlidesExplorer() {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [slides, setSlides] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (user, token) => {
        setToken(token);
        setUser(user);
        setNeedsAuth(false);
        loadSlides(token);
      },
      () => {
        setNeedsAuth(true);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await googleWorkspaceSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        loadSlides(result.accessToken);
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error('Login failed:', err);
        setError('Login failed: ' + err.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadSlides = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = encodeURIComponent("mimeType='application/vnd.google-apps.presentation' and trashed=false");
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,thumbnailLink,modifiedTime)&orderBy=modifiedTime desc`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!response.ok) {
        throw new Error(`Drive API returned ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      setSlides(data.files || []);
    } catch (err: any) {
      console.error('Failed to load slides:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-[#121212] border border-neutral-850 rounded-xl space-y-4 max-w-lg mx-auto mt-10">
        <Presentation className="w-12 h-12 text-blue-500 mb-2" />
        <h3 className="text-lg font-bold text-white text-center">Connect Google Slides</h3>
        <p className="text-xs text-neutral-400 text-center mb-4">
          Sign in to access your Google Slides presentations directly from the corporate archives.
        </p>
        
        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="gsi-material-button disabled:opacity-50"
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper flex items-center bg-white text-black px-4 py-2 rounded shadow-sm font-medium hover:bg-neutral-100 transition transition-colors">
            <div className="gsi-material-button-icon mr-3 flex items-center">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">Sign in with Google</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header intro panel */}
      <div className="border-b border-neutral-900 pb-5 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-mono font-extrabold text-blue-500 tracking-widest block uppercase mb-1 flex items-center gap-2">
            <Presentation className="w-3.5 h-3.5" />
            Workspace Integration
          </span>
          <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            Corporate Slides
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Review and present external pitch decks directly through the internal platform using your Google Workspace connection.
          </p>
        </div>
        
        {user && (
          <div className="text-right">
            <p className="text-[10px] text-neutral-500 font-mono">Connected as</p>
            <p className="text-xs font-bold text-neutral-300">{user.email}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-400">Sync Error</h4>
            <p className="text-xs text-red-300/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {selectedSlideId ? (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedSlideId(null)}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            &larr; Back to Presentations
          </button>
          
          <div className="w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-850 shadow-2xl relative">
            {/* Embedded Google Slide using iframe */}
            <iframe 
              src={`https://docs.google.com/presentation/d/${selectedSlideId}/embed?start=false&loop=false&delayms=3000`} 
              frameBorder="0" 
              width="100%" 
              height="100%" 
              allowFullScreen
              className="absolute inset-0"
              title="Google Slides Presentation"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Presentations</h3>
            <button 
              onClick={() => token && loadSlides(token)}
              disabled={isLoading}
              className="text-[10px] font-mono text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1"
            >
              <Loader2 className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {isLoading && slides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-neutral-500 animate-spin mb-4" />
              <p className="text-xs text-neutral-400 font-mono">Syncing Workspace...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map(slide => (
                <button
                  key={slide.id}
                  onClick={() => setSelectedSlideId(slide.id)}
                  className="bg-[#101010] hover:bg-[#151515] border border-neutral-850 hover:border-blue-900/50 rounded-xl p-3 flex flex-col text-left transition-all group"
                >
                  <div className="w-full h-32 bg-neutral-900 rounded-lg mb-3 overflow-hidden relative border border-neutral-800">
                    {slide.thumbnailLink ? (
                      <img src={slide.thumbnailLink} alt={slide.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Presentation className="w-8 h-8 text-neutral-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-blue-600 text-white font-bold tracking-wider text-[10px] uppercase px-3 py-1.5 rounded-full flex items-center shadow-lg">
                        Present <ChevronRight className="w-3 h-3 ml-1" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {slide.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">
                        {slide.modifiedTime ? new Date(slide.modifiedTime).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              {slides.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12 bg-[#0c0c0c] border border-neutral-900 border-dashed rounded-xl">
                  <Presentation className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-400 font-medium">No presentations found</p>
                  <p className="text-xs text-neutral-500 mt-1">Your Google Drive doesn't have any Slide decks yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
