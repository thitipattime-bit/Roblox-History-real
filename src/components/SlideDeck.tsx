import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LOCALIZED_VOLUMES } from "../lib/translations";
import { Volume, HistorySnippet } from "../types";
import { ArrowLeft, ArrowRight, HelpCircle, Info, Calendar, Sparkles, X, ChevronRight, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

// Dynamic Icon rendering helper to avoid manual switch loops
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <HelpCircle className={className} />;
  return <IconComponent className={className} />;
}

interface SlideDeckProps {
  onGoToSandbox: () => void;
}

export default function SlideDeck({ onGoToSandbox }: SlideDeckProps) {
  const { language, t } = useLanguage();
  const volumes = LOCALIZED_VOLUMES(language);
  
  // Current Slide Index: 0 = Cover, 1 to 5 = Volumes
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [activeDetail, setActiveDetail] = useState<HistorySnippet | null>(null);

  const totalSlides = volumes.length + 1; // 1 Cover + 5 volumes

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-3 md:py-6 flex flex-col justify-center min-h-[720px]">
      {/* Upper Slider Controller Info */}
      <div className="flex justify-between items-center mb-4 text-xs font-mono text-neutral-500">
        <span className="tracking-widest animate-pulse h-[16px] inline-block">
          {currentSlide === 0 ? t("nav_intro") : t("nav_slide_num", [currentSlide, totalSlides - 1])}
        </span>
        <div className="flex items-center gap-1.5 bg-[#121212] px-3 py-1 rounded-full border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-red-650 animate-pulse" />
          <span className="text-neutral-400">{t("nav_presentation_deck")}</span>
        </div>
      </div>

      {/* Main Slide Window with Slide Transitions */}
      <div className="bg-[#050505] border border-neutral-800/80 rounded-2xl min-h-[580px] shadow-3xl p-6 md:p-12 relative overflow-hidden flex flex-col justify-center transition-all bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.06),transparent_60%)]">
        
        {/* Ambient grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.1)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {currentSlide === 0 ? (
            /* COVER SLIDE */
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="text-center space-y-6 py-10 relative z-10 flex flex-col justify-center items-center flex-1"
            >
              <div className="space-y-3">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="inline-block px-3 py-1 bg-red-950/30 text-red-500 rounded-full border border-red-550/20 text-xs font-mono font-bold tracking-widest uppercase mb-3"
                >
                  {t("cover_presentation")}
                </motion.div>
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.95] text-white">
                  {t("cover_title_pres")}<span className="roblox-red">{t("cover_title_archives")}</span>
                </h1>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="h-[1px] w-12 sm:w-20 md:w-24 bg-red-600/30"></div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest-xl text-slate-500 font-semibold font-sans">
                    {t("cover_subtitle")}
                  </p>
                  <div className="h-[1px] w-12 sm:w-20 md:w-24 bg-red-600/30"></div>
                </div>
              </div>

              <div className="max-w-lg text-xs sm:text-sm text-neutral-500 leading-relaxed pt-2">
                {t("cover_description")}
              </div>

              <div className="pt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-red-650 hover:bg-red-700 active:scale-95 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  {t("cover_btn_journey")} <ArrowRight className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={onGoToSandbox}
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs font-bold tracking-widest uppercase rounded-xl border border-neutral-850 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {t("cover_btn_sandbox")}
                </button>
              </div>

              <div className="text-[10px] text-neutral-600 font-mono pt-12 animate-bounce">
                {t("cover_scroll_hint")}
              </div>
            </motion.div>
          ) : (
            /* VOLUME SLIDES (1 - 5) */
            <motion.div
              key={`volume-${currentSlide}`}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex flex-col justify-between flex-1 py-1"
            >
              {/* Header block with Vol Indicator */}
              <div className="flex justify-between items-start border-b border-neutral-900 pb-4 mb-6">
                <div>
                  <span className="text-red-550 font-mono text-xs font-bold uppercase tracking-widest block mb-1">
                    {t("volume_lbl")} {volumes[currentSlide - 1].romanId}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white border-l-4 border-red-655 pl-3">
                    {volumes[currentSlide - 1].title}
                  </h2>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono text-neutral-500 block uppercase">{t("scope_theme")}</span>
                  <span className="text-xs text-neutral-300 italic">
                    {volumes[currentSlide - 1].subtitle}
                  </span>
                </div>
              </div>

              {/* Main Contents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-auto w-full">
                {volumes[currentSlide - 1].snippets.map((snippet, idx) => (
                  <div
                    key={snippet.id}
                    onClick={() => setActiveDetail(snippet)}
                    className="group card-gradient rounded-xl p-5 cursor-pointer flex flex-col justify-between h-52 relative overflow-hidden"
                  >
                    <div>
                      {/* Top icon and tag */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="p-2 bg-neutral-950 rounded-lg group-hover:bg-red-950/20 group-hover:text-red-500 text-neutral-400 transition-colors">
                          <DynamicIcon name={snippet.icon} className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">
                          {t(`category_${snippet.category}`) || snippet.category}
                        </span>
                      </div>

                      {/* Title & Body description */}
                      <h3 className="font-display font-bold text-base text-neutral-100 group-hover:text-white transition-colors mb-2">
                        {snippet.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                        {snippet.description}
                      </p>
                    </div>

                    {/* Footer snippet stat or click message */}
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-neutral-950 text-[10px] font-mono">
                      {snippet.stats ? (
                        <div className="text-neutral-500">
                          {snippet.stats.label}: <span className="text-red-400 font-bold">{snippet.stats.value}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-600">{t("snippet_record")}</span>
                      )}
                      <span className="text-neutral-600 group-hover:text-red-500 transition-colors flex items-center gap-0.5 font-bold">
                        {t("snippet_read_story")} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Top right subtle red glow */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-red-650/0 to-transparent group-hover:from-red-650/10 rounded-bl-full pointer-events-none transition-all" />
                  </div>
                ))}
              </div>

              {/* Bottom Volume Info bar explaining details */}
              <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-500 font-mono">
                <span>{t("nav_interaction_tip")}</span>
                <span>{t("nav_click_card")}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Navigation Panel */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition-all flex items-center gap-2 text-xs font-mono uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {t("nav_btn_prev")}
        </button>

        {/* Bullet Progress Steps */}
        <div className="flex gap-2 items-center">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? "w-8 bg-red-600"
                  : "w-2 bg-neutral-800 hover:bg-neutral-700"
              }`}
              title={`Jump to slide ${idx === 0 ? "Cover" : `Vol ${idx}`}`}
            />
          ))}
        </div>

        {currentSlide < totalSlides - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2.5 rounded-xl bg-red-650 hover:bg-red-700 transition-colors text-white flex items-center gap-2 text-xs font-mono uppercase font-bold shadow-lg shadow-red-950/20 cursor-pointer"
          >
            {t("nav_btn_next")} <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onGoToSandbox}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold flex items-center gap-2 text-xs font-mono uppercase shadow-lg shadow-amber-955/20 cursor-pointer"
          >
            {t("nav_btn_open_sandbox")} <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* EXPANDED HISTORICAL ARCHIVES DRAWER / MODAL */}
      <AnimatePresence>
        {activeDetail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="card-gradient rounded-2xl max-w-xl w-full p-6 md:p-8 relative shadow-3xl text-left overflow-hidden border border-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover red spotlight decoration */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 blur-2xl rounded-full" />

              {/* Header snippet details */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-950 text-red-500 rounded-xl border border-neutral-850 shrink-0">
                    <DynamicIcon name={activeDetail.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                      {t("drawer_hdr")} • {t(`category_${activeDetail.category}`) || activeDetail.category}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                      {activeDetail.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDetail(null)}
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main deep historical background details content */}
              <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed max-h-[350px] overflow-y-auto pr-2 mt-4">
                <p className="font-medium text-neutral-200">
                  {activeDetail.description}
                </p>
                <div className="border-t border-neutral-850 pt-4 mt-2">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-wide block mb-1 font-bold">
                    {t("drawer_investigations")}
                  </span>
                  <p className="text-neutral-450 leading-relaxed text-xs">
                    {activeDetail.extendedDetails || "Archived records indicate high community participation during this history epoch, leading to structural shifts in gameplay habits and virtual networking mechanisms across global developer territories."}
                  </p>
                </div>

                {activeDetail.stats && (
                  <div className="bg-[#181818] p-3 rounded-lg border border-neutral-900 flex justify-between items-center font-mono mt-4">
                    <span className="text-neutral-500 text-xs uppercase font-semibold">
                      {activeDetail.stats.label}
                    </span>
                    <span className="text-red-500 font-bold text-sm">
                      {activeDetail.stats.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal dismiss action */}
              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-neutral-900">
                <button
                  onClick={() => setActiveDetail(null)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 text-xs font-mono uppercase font-bold rounded-xl transition-colors border border-neutral-850 cursor-pointer"
                >
                  {t("drawer_close")}
                </button>
                <button
                  onClick={() => {
                    setActiveDetail(null);
                    onGoToSandbox();
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {t("drawer_test_sim")} <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
