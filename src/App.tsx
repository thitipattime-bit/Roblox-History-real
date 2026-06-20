/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, Sparkles, Sliders, Grid, Cpu, History, Calendar, TrendingUp, Clock, HelpCircle, ShieldCheck, Sun, Moon, Globe, Search, X, Presentation } from "lucide-react";
import SlideDeck from "./components/SlideDeck";
import TimelineView from "./components/TimelineView";
import DevExCalc from "./components/DevExCalc";
import TradingGame from "./components/TradingGame";
import ServerFixer from "./components/ServerFixer";
import HistoryQuiz from "./components/HistoryQuiz";
import BotVerification from "./components/BotVerification";
import UserAuth, { RobloxUser } from "./components/UserAuth";
import ImageStudio from "./components/ImageStudio";
import WebSocketTester from "./components/WebSocketTester";
import RobloxBoombox from "./components/RobloxBoombox";
import GoogleSlidesExplorer from "./components/GoogleSlidesExplorer";
import { useLanguage } from "./lib/LanguageContext";
import { LOCALIZED_VOLUMES } from "./lib/translations";

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"deck" | "explorer" | "sandbox" | "studio" | "workspace">("deck");
  const [searchVal, setSearchVal] = useState<string>("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const [timelineSearchQuery, setTimelineSearchQuery] = useState<string>("");
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string | null>(null);

  // Live matching search algorithm for global header search
  const searchValLower = searchVal.toLowerCase().trim();
  const searchResults = useMemo(() => {
    if (!searchValLower) return [];
    
    const results: { snippet: any; volumeRomanId: string; volumeTitle: string }[] = [];
    const vols = LOCALIZED_VOLUMES(language);
    vols.forEach((volume) => {
      volume.snippets.forEach((snippet) => {
        const matchesTitle = snippet.title.toLowerCase().includes(searchValLower);
        const matchesDesc = snippet.description.toLowerCase().includes(searchValLower);
        const matchesExt = snippet.extendedDetails ? snippet.extendedDetails.toLowerCase().includes(searchValLower) : false;
        const matchesVol = volume.title.toLowerCase().includes(searchValLower);
        
        if (matchesTitle || matchesDesc || matchesExt || matchesVol) {
          results.push({
            snippet,
            volumeRomanId: volume.romanId,
            volumeTitle: volume.title
          });
        }
      });
    });
    return results.slice(0, 8); // return top 8 matches max for screen layout safety
  }, [searchValLower, language]);
  const [timeStr, setTimeStr] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("roblox_archives_theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("roblox_archives_theme", theme);
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);
  const [currentUser, setCurrentUser] = useState<RobloxUser | null>(() => {
    const saved = localStorage.getItem("roblox_archives_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const adjustUserRobux = async (amount: number) => {
    if (!currentUser) return;
    const nextBalance = Math.max(0, currentUser.simulatedRobux + amount);
    const updated = {
      ...currentUser,
      simulatedRobux: nextBalance,
    };
    setCurrentUser(updated);

    localStorage.setItem("roblox_archives_current_user", JSON.stringify(updated));

    if (currentUser.uid) {
      try {
        const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("./lib/firebase");
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          simulatedRobux: nextBalance,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Failed to sync updated balance to Firebase:", error);
      }
    } else {
      const savedDict = localStorage.getItem("roblox_archives_users");
      if (savedDict) {
        try {
          const parsed = JSON.parse(savedDict);
          const uKey = currentUser.username.toLowerCase();
          if (parsed[uKey]) {
            parsed[uKey].userObj = updated;
            localStorage.setItem("roblox_archives_users", JSON.stringify(parsed));
          }
        } catch (e) {
          console.error("Failed to sync robux to database", e);
        }
      }
    }
  };

  // Update dynamic ticking archive clock to give it a premium visual system vibe
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString(language === "th" ? "th-TH" : "en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-red-650 selection:text-white relative">
      <div className="absolute inset-0 bg-glow pointer-events-none z-0"></div>
      
      {/* GLOWING HEADER SPOTLIGHT DESIGN */}
      <header className="border-b border-neutral-900 bg-[#050505]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex justify-between items-center">
        
        {/* Logo and metadata branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black font-display text-lg shadow-lg shadow-red-950/40 shrink-0 text-white select-none">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h1 className="font-display font-extrabold text-base md:text-lg tracking-wider uppercase">
                {t("archives_title")}
              </h1>
              <span className="text-[10px] bg-red-950 text-red-500 font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border border-red-950">
                {t("archives_vols")}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono leading-none mt-1">
              {t("archives_tagline")}
            </p>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden sm:block flex-1 max-w-[180px] md:max-w-[260px] lg:max-w-[340px] mx-4 relative z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder={language === "th" ? "ค้นหาประวัติศาสตร์..." : "Search corporate archives..."}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#101010] hover:bg-[#121212] focus:bg-[#121212] border border-neutral-850 focus:border-red-650/80 pl-9 pr-8 py-2 text-xs text-neutral-200 placeholder-neutral-500 rounded-lg focus:outline-none font-mono transition-all"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Floated Search Dropdown results */}
          {searchVal.trim() && (
            <>
              {/* Backing dismiss overlay */}
              <div className="fixed inset-0 z-40 cursor-default" onClick={() => setSearchVal("")} />
              
              <div className="absolute top-full mt-2 left-0 right-0 max-h-80 overflow-y-auto bg-[#070707]/98 backdrop-blur-xl border border-neutral-850 rounded-xl shadow-2xl p-2 space-y-1 z-50 divide-y divide-neutral-900">
                {searchResults.length > 0 ? (
                  searchResults.map(({ snippet, volumeRomanId, volumeTitle }) => (
                    <button
                      key={snippet.id}
                      onClick={() => {
                        setHighlightedSnippetId(snippet.id);
                        setTimelineSearchQuery(""); // clean subsearch to prevent initial double-filters
                        setActiveTab("explorer");
                        setSearchVal("");
                      }}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-900/80 transition-all flex flex-col gap-1 cursor-pointer group border border-transparent hover:border-neutral-850/40"
                    >
                      <div className="flex justify-between items-center text-[9px] text-neutral-500 font-mono">
                        <span className="text-red-500 font-black uppercase tracking-wider">{volumeRomanId}</span>
                        <span className="truncate max-w-[120px]">{volumeTitle}</span>
                      </div>
                      <h4 className="font-display font-extrabold text-xs text-neutral-100 group-hover:text-red-500 transition-colors">
                        {snippet.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-1 font-sans">
                        {snippet.description}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-3.5 text-center text-neutral-500 font-mono text-[10.5px]">
                    {language === "th" ? "ไม่พบเอกสารประวัติศาสตร์ที่ค้นหา ⚠️" : "No archives found matching search ⚠️"}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Global Navigation controls and live metadata indicator */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            title={language === "en" ? "Search archives" : "ค้นหาเอกสารคลัง"}
            className="sm:hidden p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-xl transition-all cursor-pointer flex items-center justify-center text-neutral-450 hover:text-white"
            id="mobile-search-toggle"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="sr-only">Search</span>
          </button>

          {/* Language Switcher Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "th" : "en")}
            title={language === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
            className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-white uppercase group"
            id="lang-toggle-btn"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-450 mr-1 group-hover:text-red-500 transition-colors shrink-0" />
            <span className={language === "en" ? "text-red-500 font-extrabold" : "text-neutral-500"}>EN</span>
            <span className="text-neutral-800">/</span>
            <span className={language === "th" ? "text-red-500 font-extrabold" : "text-neutral-500"}>TH</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-2.5 bg-neutral-955 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-xl transition-all cursor-pointer flex items-center justify-center relative group"
            id="theme-toggle-btn"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500 animate-[bounce_3s_infinite]" />
            )}
            <span className="sr-only">Toggle Theme</span>
          </button>

          {/* User Sign In and Profile actions */}
          <UserAuth 
            currentUser={currentUser} 
            onLogin={(user) => setCurrentUser(user)} 
            onLogout={() => setCurrentUser(null)} 
          />

          {/* Security human check indicator and control */}
          {isVerified ? (
            <div
              className="flex items-center gap-1.5 font-mono text-[10px] text-green-400 bg-green-950/20 border border-green-800/40 rounded-lg px-2.5 py-1.5 select-none"
              title="Classic Bot Defense Status Checked"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline">BOT OK</span>
              <span className="sm:hidden">SECURE</span>
            </div>
          ) : (
            <button
              onClick={() => setIsVerified(false)}
              className="flex items-center gap-1.5 font-mono text-[10px] text-red-500 bg-red-955/20 border border-red-500/20 hover:bg-neutral-900 rounded-lg px-2.5 py-1.5 transition-colors uppercase font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0"></span>
              <span>CAPTCHA</span>
            </button>
          )}

          {/* UTC Clock metadata detail */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-900 px-3 py-1.5 rounded-lg">
            <Clock className="w-3 h-3 text-red-500 shrink-0" />
            <span>{t("exhibit_time")}</span>
            <span className="text-white font-bold">{timeStr || "20:27:58"}</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 font-mono text-[10px] text-neutral-400 bg-neutral-950 border border-neutral-900 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3 h-3 text-red-500 shrink-0" />
            <span>{t("est_date")}</span>
            <span className="text-white font-bold">2004 - 2026</span>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar Expansion Panel (Mobile only) */}
      {isMobileSearchOpen && (
        <div className="sm:hidden bg-[#070707] border-b border-neutral-900 p-3 sticky top-[69px] z-30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder={language === "th" ? "ค้นหาประวัติศาสตร์..." : "Search corporate archives..."}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-850 pl-10 pr-8 py-2 text-xs text-neutral-250 placeholder-neutral-500 rounded-lg focus:outline-none focus:border-red-650 font-mono text-white"
              autoFocus
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Floated Search Dropdown results for mobile */}
          {searchVal.trim() && (
            <div className="mt-2 text-left max-h-64 overflow-y-auto bg-[#070707] border border-neutral-850 rounded-lg p-1.5 space-y-1 divide-y divide-neutral-900">
              {searchResults.length > 0 ? (
                searchResults.map(({ snippet, volumeRomanId, volumeTitle }) => (
                  <button
                    key={snippet.id}
                    onClick={() => {
                      setHighlightedSnippetId(snippet.id);
                      setTimelineSearchQuery("");
                      setActiveTab("explorer");
                      setSearchVal("");
                      setIsMobileSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-900 transition-all flex flex-col gap-1 cursor-pointer group"
                  >
                    <div className="flex justify-between items-center text-[9px] text-neutral-500 font-mono">
                      <span className="text-red-500 font-black uppercase tracking-wider">{volumeRomanId}</span>
                      <span className="truncate max-w-[150px]">{volumeTitle}</span>
                    </div>
                    <h4 className="font-display font-extrabold text-xs text-neutral-100">
                      {snippet.title}
                    </h4>
                    <p className="text-[10px] text-neutral-450 line-clamp-2 leading-tight font-sans">
                      {snippet.description}
                    </p>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-neutral-500 font-mono text-[10px]">
                  {language === "th" ? "ไม่พบเอกสารประวัติศาสตร์ที่ค้นหา ⚠️" : "No archives found matching search ⚠️"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEWPORT CONTROLLER ROW */}
      <div className="bg-[#090909] border-b border-neutral-900/60 sticky top-[69px] z-35 py-3 px-4 flex justify-center">
        <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-900 max-w-3xl w-full grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab("deck")}
            className={`py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "deck"
                ? "bg-red-600 text-white font-bold shadow-md shadow-red-950/20"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t("tab_slides")}</span>
            <span className="sm:hidden">{t("tab_slides_short") || "Slides"}</span>
          </button>

          <button
            onClick={() => setActiveTab("explorer")}
            className={`py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "explorer"
                ? "bg-red-600 text-white font-bold shadow-md shadow-red-950/20"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t("tab_database")}</span>
            <span className="sm:hidden">{t("tab_db_short") || "Data"}</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "sandbox"
                ? "bg-red-600 text-white font-bold shadow-md shadow-red-950/20"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <History className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t("tab_sandbox")}</span>
            <span className="sm:hidden">{t("tab_sandbox_short") || "Sandbox"}</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "studio"
                ? "bg-red-600 text-white font-bold shadow-md shadow-red-950/20"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">{t("tab_studio")}</span>
            <span className="sm:hidden">{t("tab_studio_short") || "Studio"}</span>
          </button>

          <button
            onClick={() => setActiveTab("workspace")}
            className={`py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "workspace"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-900/20"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Presentation className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span className="hidden sm:inline">Slides</span>
            <span className="sm:hidden">Slides</span>
          </button>
        </div>
      </div>

      {/* CORE FRAME LAYOUT */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "deck" && (
          <div className="py-6 min-h-[640px] flex items-center">
            <SlideDeck onGoToSandbox={() => setActiveTab("sandbox")} />
          </div>
        )}

        {activeTab === "explorer" && (
          <div className="py-2">
            <TimelineView 
              initialSearchQuery={timelineSearchQuery}
              onClearInitialSearch={() => setTimelineSearchQuery("")}
              highlightedSnippetId={highlightedSnippetId}
              onClearHighlight={() => setHighlightedSnippetId(null)}
            />
          </div>
        )}

        {activeTab === "sandbox" && (
          <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
            
            {/* Header intro panel */}
            <div className="border-b border-neutral-900 pb-5">
              <span className="text-[10px] font-mono font-extrabold text-red-500 tracking-widest block uppercase mb-1">
                {t("sandbox_hdr")}
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
                {t("sandbox_title")}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                {t("sandbox_desc")}
              </p>
            </div>

            {/* Split dashboard layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* LEFT PLUGS COLUMN: ECONOMY ZONE */}
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold text-neutral-450 uppercase mb-2 tracking-wider flex items-center gap-1.5 text-neutral-400">
                    <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                    {t("section_economy")}
                  </div>
                  <div className="space-y-6">
                    <DevExCalc />
                    <TradingGame 
                      currentUser={currentUser}
                      adjustUserRobux={adjustUserRobux}
                      onOpenAuth={() => window.dispatchEvent(new Event("roblox-open-auth"))}
                    />
                    <RobloxBoombox />
                  </div>
                </div>
              </div>

              {/* RIGHT PLUGS COLUMN: TECH & TRIVIA ZONE */}
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold text-neutral-450 uppercase mb-2 tracking-wider flex items-center gap-1.5 text-neutral-400">
                    <Cpu className="w-3.5 h-3.5 text-red-500" />
                    {t("section_tech")}
                  </div>
                  <div className="space-y-6">
                    <ServerFixer />
                    <HistoryQuiz 
                      currentUser={currentUser}
                      adjustUserRobux={adjustUserRobux}
                      onOpenAuth={() => window.dispatchEvent(new Event("roblox-open-auth"))}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* WebSocket Multi-Agent Load Tester */}
            <WebSocketTester />

          </div>
        )}

        {activeTab === "studio" && (
          <ImageStudio 
            currentUser={currentUser} 
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem("roblox_archives_current_user", JSON.stringify(updated));
            }}
          />
        )}

        {activeTab === "workspace" && (
          <GoogleSlidesExplorer />
        )}
      </main>

      {/* FOOTER METADATA STAMP */}
      <footer className="border-t border-neutral-900 bg-neutral-950/60 py-6 px-4 md:px-8 text-neutral-500 font-mono text-[10px] text-center md:flex md:justify-between md:items-center space-y-3 md:space-y-0 relative z-10">
        <div className="space-y-1 text-left sm:text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-neutral-400 font-bold uppercase tracking-wider">{t("server_node")}</span>
          </div>
          <p className="text-[9px] text-neutral-600">
            © 2026 {t("copyright_corp")}
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-1 font-sans">
          <div className="flex justify-center md:justify-end gap-3 text-[10px] text-neutral-500">
            <span>© {new Date().getFullYear()} Roblox Corporation</span>
            <span>&bull;</span>
            <span className="text-red-500/80 font-semibold tracking-widest text-[9px] uppercase">{t("internal_use")}</span>
          </div>
          <p className="text-[8px] text-neutral-600 tracking-tight text-center md:text-right">
            {t("all_trademarks")}
          </p>
        </div>
      </footer>

      {/* Bot Verification Security Challenge */}
      {!isVerified && (
        <BotVerification onVerifySuccess={() => setIsVerified(true)} />
      )}
    </div>
  );
}
