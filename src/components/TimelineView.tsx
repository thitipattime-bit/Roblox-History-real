import React, { useState, useMemo } from "react";
import { LOCALIZED_VOLUMES } from "../lib/translations";
import { HistorySnippet, Volume } from "../types";
import { Search, Calendar, Filter, Sparkles, HelpCircle, X, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

// Dynamic Icon loader
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <HelpCircle className={className} />;
  return <IconComponent className={className} />;
}

export interface TimelineViewProps {
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
  highlightedSnippetId?: string | null;
  onClearHighlight?: () => void;
}

export default function TimelineView({
  initialSearchQuery = "",
  onClearInitialSearch,
  highlightedSnippetId = null,
  onClearHighlight,
}: TimelineViewProps = {}) {
  const { language, t } = useLanguage();
  const volumes = LOCALIZED_VOLUMES(language);
  
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery || " ");
  React.useEffect(() => {
    if (!initialSearchQuery) {
      setSearchQuery("");
    } else {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSnippet, setActiveSnippet] = useState<HistorySnippet | null>(null);

  // Flatten the slides data to simple list of cards alongside their parent volume context
  const allSnippets = useMemo(() => {
    const list: (HistorySnippet & { volumeRomanId: string; volumeTitle: string })[] = [];
    volumes.forEach((volume) => {
      volume.snippets.forEach((snippet) => {
        list.push({
          ...snippet,
          volumeRomanId: volume.romanId,
          volumeTitle: volume.title,
        });
      });
    });
    return list;
  }, [volumes]);

  // Open highlighted snippet in modal/drawer immediately
  React.useEffect(() => {
    if (highlightedSnippetId) {
      const found = allSnippets.find((snip) => snip.id === highlightedSnippetId);
      if (found) {
        setActiveSnippet(found);
        if (onClearHighlight) {
          onClearHighlight();
        }
      }
    }
  }, [highlightedSnippetId, allSnippets, onClearHighlight]);

  // Filter and search computation
  const filteredSnippets = useMemo(() => {
    return allSnippets.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) {
        return selectedCategory === "all" || item.category === selectedCategory;
      }
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.volumeTitle.toLowerCase().includes(q) ||
        (item.extendedDetails && item.extendedDetails.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allSnippets, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      
      {/* Filters Headline block */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8 pb-5 border-b border-neutral-900">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
            {language === "th" ? "คลังแฟ้มสืบค้นประวัติศาสตร์ย้อนหลัง" : "The Knowledge Database"}
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            {language === "th" ? "ตรวจสอบ ค้นหา และกรองข้อมูลเอกสารบริษัทอย่างเป็นทางการทั้ง 15 แฟ้ม" : "Search, sort, and query all 15 historic Roblox corporate archive files"}
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder={language === "th" ? "พิมพ์ค้นหาคีย์เวิร์ดประวัติย้อนหลัง..." : "Search history files..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-850 pl-10 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 rounded-lg focus:outline-none focus:border-red-650 font-mono transition-colors"
            />
          </div>

          {/* Category drop tag filters */}
          <div className="flex gap-1.5 overflow-x-auto shrink-0 py-1">
            {["all", "milestone", "economy", "community", "tech"].map((category) => {
              let label = category.toUpperCase();
              if (language === "th") {
                if (category === "all") label = "ทั้งหมด";
                else if (category === "milestone") label = "เหตุการณ์สำคัญ";
                else if (category === "economy") label = "ระบบเศรษฐกิจ";
                else if (category === "community") label = "ชุมชน/ผู้เล่น";
                else if (category === "tech") label = "เทคโนโลยี";
              }

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    selectedCategory === category
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-[#121212] border-neutral-850 text-neutral-400 hover:border-neutral-750"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((item) => {
            let catLabel = item.category.toUpperCase();
            if (language === "th") {
              if (item.category === "milestone") catLabel = "เหตุการณ์สำคัญ";
              else if (item.category === "economy") catLabel = "ระบบเศรษฐกิจ";
              else if (item.category === "community") catLabel = "ชุมชนย้อนยุค";
              else if (item.category === "tech") catLabel = "วิศวกรรมเทคนิค";
            }

            return (
              <div
                key={item.id}
                onClick={() => setActiveSnippet(item)}
                className="group card-gradient border border-neutral-850 rounded-xl p-5 cursor-pointer flex flex-col justify-between min-h-[220px] hover:border-neutral-700/60 transition-all shadow-md"
              >
                {/* Top volume locator details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pb-2 border-b border-neutral-950">
                    <span className="font-black text-red-500 block uppercase tracking-wider">
                      {item.volumeRomanId}
                    </span>
                    <span className="truncate max-w-[150px]">{item.volumeTitle}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-900 border border-neutral-850 text-neutral-400 group-hover:text-red-500 group-hover:border-red-650/30 rounded-lg shrink-0 transition-colors">
                      <DynamicIcon name={item.icon} className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-sm text-neutral-100 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      {/* Snippet tags */}
                      <span className="inline-block text-[9px] font-mono uppercase bg-neutral-900/60 text-neutral-400 px-1.5 py-0.2 rounded border border-neutral-850/60 font-semibold">
                        {catLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed pt-1 line-clamp-3 font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Stats Footer or Trigger instructions */}
                <div className="flex justify-between items-center mt-5 pt-3 border-t border-neutral-950 font-mono text-[9px] text-neutral-500">
                  {item.stats ? (
                    <span>
                      {item.stats.label}: <strong className="text-neutral-300 font-black">{item.stats.value}</strong>
                    </span>
                  ) : (
                    <span>{language === "th" ? "เอกสารบริษัทถาวร" : "Corporate File"}</span>
                  )}
                  <span className="group-hover:text-red-500 text-neutral-600 font-black transition-colors flex items-center gap-0.5">
                    {language === "th" ? "สืบค้น" : "Expand"} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#121212]/40 rounded-xl border border-neutral-900">
          <Calendar className="w-10 h-10 text-neutral-650 mx-auto mb-3 text-neutral-600" />
          <h3 className="font-display text-base font-semibold text-neutral-300">
            {language === "th" ? "ไม่พบเอกสารประวัติศาสตร์ที่ค้นหา" : "No Historical Records Found"}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto font-sans">
            {language === "th" ? "ลองพิมพ์แก้ไขคีย์เวิร์ดคำค้นหาหรือตั้งกลุ่มเป้าหมายการกรองใหม่อีกครั้ง" : "Try adjusting your words in the search input or choosing a different subject tag filter."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 px-4 py-2 bg-neutral-900 text-neutral-300 text-xs font-mono uppercase font-bold rounded-lg hover:text-white border border-neutral-800 transition-colors cursor-pointer"
          >
            {language === "th" ? "ล้างช่องและตัวกรองค้นหา" : "Clear Search Filter"}
          </button>
        </div>
      )}

      {/* DETAIL DRAWER MODAL OVERLAY */}
      {activeSnippet && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            className="card-gradient rounded-2xl max-w-xl w-full p-6 md:p-8 relative shadow-3xl text-left overflow-hidden border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Spotlight decoration */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 blur-2xl rounded-full" />

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-neutral-950 text-red-500 border border-neutral-850 rounded-xl">
                  <DynamicIcon name={activeSnippet.icon} className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                    {language === "th" ? "เอกสารกลุ่ม " : ""}{activeSnippet.volumeRomanId} {language === "th" ? "• หมวดระบบ " : "• "}{activeSnippet.category}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-black text-white">
                    {activeSnippet.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveSnippet(null)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 transition-colors cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed max-h-[350px] overflow-y-auto pr-2 mt-4 font-sans">
              <p className="font-semibold text-neutral-200 leading-relaxed">
                {activeSnippet.description}
              </p>
              <div className="border-t border-neutral-850 pt-4 mt-2">
                <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest block mb-1.5 font-bold">
                  {language === "th" ? "สืบค้นเจาะลึกนิทรรศการเอกสาร:" : "Extended Investigations:"}
                </span>
                <p className="text-zinc-400 leading-relaxed text-[13px]">
                  {activeSnippet.extendedDetails || (language === "th" ? "เอกสารนี้รวบรวมเหตุการณ์ปฏิวัติระบบประดิษฐ์สร้างกลไกฟิสิกส์และการเงินจำลองของ Roblox เพื่อประโยน์แห่งการเรียนรู้เชิงลึกของสาธารณชน" : "This corporate chronicle records architectural paradigm shifts inside the core experience engine of Roblox, contributing to massive expansion, user culture transitions, or corporate value listing milestones.")}
                </p>
              </div>

              {activeSnippet.stats && (
                <div className="bg-[#181818] p-3 rounded-lg border border-neutral-900 flex justify-between items-center font-mono mt-3">
                  <span className="text-neutral-500 text-xs uppercase font-semibold">
                    {activeSnippet.stats.label}
                  </span>
                  <span className="text-red-500 font-black text-sm">
                    {activeSnippet.stats.value}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-neutral-900">
              <button
                onClick={() => setActiveSnippet(null)}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 text-xs font-mono uppercase font-bold rounded-xl transition-colors border border-neutral-850 cursor-pointer"
              >
                {language === "th" ? "กลับสู่ฐานข้อมูล" : "Return to Database"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
