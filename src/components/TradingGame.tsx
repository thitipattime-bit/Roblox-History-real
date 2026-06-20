import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, ShoppingCart, Award, Coins } from "lucide-react";
import { LOCALIZED_MARKET } from "../lib/translations";
import { LimitedItem } from "../types";
import { RobloxUser } from "./UserAuth";
import { useLanguage } from "../lib/LanguageContext";

interface TradingGameProps {
  currentUser?: RobloxUser | null;
  adjustUserRobux?: (amount: number) => void;
  onOpenAuth?: () => void;
}

export default function TradingGame({ currentUser, adjustUserRobux, onOpenAuth }: TradingGameProps) {
  const { language, t } = useLanguage();
  const [localBalance, setLocalBalance] = useState<number>(3000000); // 3 Million starting fallback Robux
  const balance = currentUser ? currentUser.simulatedRobux : localBalance;

  const setBalance = (updater: number | ((prev: number) => number)) => {
    if (currentUser && adjustUserRobux) {
      if (typeof updater === "function") {
        const next = updater(currentUser.simulatedRobux);
        adjustUserRobux(next - currentUser.simulatedRobux);
      } else {
        adjustUserRobux(updater - currentUser.simulatedRobux);
      }
    } else {
      setLocalBalance(updater);
    }
  };

  const initialMarket = LOCALIZED_MARKET(language);
  const [marketItems, setMarketItems] = useState<LimitedItem[]>(initialMarket);
  
  // Synchronize item names when language updates
  useEffect(() => {
    const freshMarket = LOCALIZED_MARKET(language);
    setMarketItems((prev) => 
      prev.map((existing) => {
        const matchingFresh = freshMarket.find((f) => f.id === existing.id);
        return {
          ...existing,
          name: matchingFresh ? matchingFresh.name : existing.name,
        };
      })
    );
  }, [language]);

  const [portfolio, setPortfolio] = useState<{ [id: string]: number }>({
    "lim-1": 0, // Dominus Frigidus
    "lim-2": 0, // Sparkle Time Fedora
    "lim-3": 1, // Valkyrie Helm starting
    "lim-4": 0,
    "lim-5": 0,
  });

  const [marketTrendLogs, setMarketTrendLogs] = useState<string[]>(() => {
    return language === "th" 
      ? ["ตลาดประมูลจำลองเปิดทำการ มูลค่าสัมพัทธ์อ้างอิงกำลังเข้าที่"]
      : ["Market opened. Scarcity values are stable."];
  });

  // Handle Tick simulation
  const simulateMarketTick = () => {
    const logs: string[] = [];
    const updated = marketItems.map((item) => {
      // Calculate random move based on item volatility
      const changePercent = (Math.random() - 0.48) * 2 * item.volatility; // slight positive drift
      const priceShift = Math.floor(item.estimatedRobux * changePercent);
      const newPrice = Math.max(10, item.estimatedRobux + priceShift);

      // Create trends
      const updatedTrend = [...item.currentTrend.slice(1), newPrice];

      if (Math.abs(changePercent) > 0.15) {
        const percent = Math.floor(Math.abs(changePercent) * 100);
        if (language === "th") {
          logs.push(
            `${item.name} ${changePercent > 0 ? "พุ่งขึ้นสูงปรี๊ด 📈" : "ฮวบลงต่ำเตี้ย 📉"} อีก ${percent}%!`
          );
        } else {
          logs.push(
            `${item.name} went ${changePercent > 0 ? "surging 📈" : "dropping 📉"} by ${percent}%!`
          );
        }
      }

      return {
        ...item,
        estimatedRobux: newPrice,
        currentTrend: updatedTrend,
      };
    });

    setMarketItems(updated);
    if (logs.length > 0) {
      setMarketTrendLogs((prev) => [logs[0], ...prev.slice(0, 3)]);
    } else {
      const defaultAdjustLog = language === "th" 
        ? "ราคาปรับตัวสมบูรณ์ทั่วทั้งแค็ตตาล็อกเสมือน" 
        : "Prices adjusted across virtual catalog.";
      setMarketTrendLogs((prev) => [defaultAdjustLog, ...prev.slice(0, 3)]);
    }
  };

  const handleBuy = (item: LimitedItem) => {
    if (balance >= item.estimatedRobux) {
      setBalance((prev) => prev - item.estimatedRobux);
      setPortfolio((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1,
      }));
    }
  };

  const handleSell = (item: LimitedItem) => {
    if ((portfolio[item.id] || 0) > 0) {
      setBalance((prev) => prev + item.estimatedRobux);
      setPortfolio((prev) => ({
        ...prev,
        [item.id]: prev[item.id] - 1,
      }));
    }
  };

  // Portfolio Worth
  const totalAssetsValue = marketItems.reduce((acc, item) => {
    const owned = portfolio[item.id] || 0;
    return acc + owned * item.estimatedRobux;
  }, 0);

  const netWorth = balance + totalAssetsValue;

  const formatRobux = (val: number) => {
    return new Intl.NumberFormat(language === "th" ? "th-TH" : "en-US").format(val);
  };

  return (
    <div id="scarcity-trading-card" className="card-gradient p-5 rounded-xl shadow-2xl relative overflow-hidden border border-neutral-850">
      <div className="absolute top-0 right-0 bg-red-600/10 text-red-500 font-mono text-[9px] tracking-wider px-3 py-1 rounded-bl-lg border-l border-b border-red-500/20 uppercase font-black">
        {language === "th" ? "เล่มที่ V ตลาดจำลองลิมิเตด" : "VOLUME V RESALE INTEGRATION"}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-red-500" />
          <h4 className="font-display font-semibold text-lg text-white">
            {language === "th" ? "ตลาดประมูลไอเทมลิมิเตดคลาสสิก" : "Classic Limiteds Exchange"}
          </h4>
        </div>
        
        <button
          onClick={simulateMarketTick}
          className="flex items-center gap-1.5 px-3 py-1 bg-red-650 hover:bg-red-700 active:scale-95 text-white font-mono text-xs font-bold rounded-lg transition-transform cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
          {language === "th" ? "ข้ามเวลาตลาด" : "TICK MARKET"}
        </button>
      </div>

      {currentUser ? (
        <div className="mb-4 bg-red-950/20 border border-red-500/10 p-3 rounded-lg flex items-center justify-between text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center font-display font-black text-[9px] text-white ${currentUser.avatarColor}`}>
              {currentUser.username[0].toUpperCase()}
            </div>
            <span>
              {language === "th" ? "โปรไฟล์: " : "Profile: "}<strong className="text-white">{currentUser.username}</strong> ({currentUser.avatarType})
            </span>
          </div>
          <span className="text-red-500 text-[9px] font-bold uppercase tracking-wider">{language === "th" ? "คลาวด์เปิดแบคอัป" : "SAVING LOGS"}</span>
        </div>
      ) : (
        <div className="mb-4 bg-neutral-900/40 border border-neutral-900/60 p-3 rounded-lg flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>{language === "th" ? "ลงชื่อเข้าใช้ประเพื่อประสานบัญชีเงินเก็บสะสมของตนเอง!" : "Sign up / Sign In to hold your own budget!"}</span>
          <button 
            type="button"
            onClick={onOpenAuth}
            className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wide underline focus:outline-none cursor-pointer"
          >
            {language === "th" ? "ลงชื่อเข้าระบบ" : "Sign In / Log In"}
          </button>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#181818] p-3 rounded-lg border border-neutral-900">
          <div className="text-[9px] text-neutral-500 uppercase font-mono mb-0.5">
            {language === "th" ? "กระเป๋าเงินสด" : "Available Cash"}
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-yellow-400 flex items-center gap-0.5 truncate">
            <Coins className="w-3.5 h-3.5 shrink-0" />
            {formatRobux(balance)} R$
          </div>
        </div>
        <div className="bg-[#181818] p-3 rounded-lg border border-neutral-900">
          <div className="text-[9px] text-neutral-500 uppercase font-mono mb-0.5">
            {language === "th" ? "ทรัพย์สินลิมิเตด" : "My Asset Worth"}
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-blue-400 truncate">
            {formatRobux(totalAssetsValue)} R$
          </div>
        </div>
        <div className="bg-[#181818] p-3 rounded-lg border border-neutral-900">
          <div className="text-[9px] text-neutral-500 uppercase font-mono mb-0.5">
            {language === "th" ? "ทรัพย์สินสุทธิรวม" : "My Total Worth"}
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-green-400 truncate">
            {formatRobux(netWorth)} R$
          </div>
        </div>
      </div>

      {/* Main Items Listing */}
      <div className="space-y-3 max-h-[285px] overflow-y-auto pr-1">
        {marketItems.map((item) => {
          const owned = portfolio[item.id] || 0;
          const firstTrend = item.currentTrend[0];
          const lastTrend = item.currentTrend[item.currentTrend.length - 1];
          const isUp = lastTrend >= firstTrend;

          return (
            <div
              key={item.id}
              className="bg-[#181818] p-3 rounded-lg border border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors hover:border-neutral-800"
            >
              {/* Left Column Names info */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-semibold text-xs sm:text-sm text-neutral-100 flex items-center gap-1.5 flex-wrap">
                    {item.name}
                    {owned > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-300 font-mono text-[9px] rounded-full border border-blue-500/20 font-bold shrink-0">
                        {language === "th" ? `ครอบครอง x${owned}` : `x${owned} Owned`}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-550 text-neutral-500 mt-0.5">
                    {language === "th" ? "ราคาตั้งต้น: " : "Orig Price: "}<span className="font-mono">{formatRobux(item.basePrice)} R$</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Current Price */}
              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
                {/* Simulated Sparkline */}
                <div className="flex items-end gap-0.5 h-6 shrink-0 bg-[#0d0d0d] px-2 py-1 rounded border border-neutral-900/70">
                  {item.currentTrend.map((price, idx) => {
                    const maxPrice = Math.max(...item.currentTrend);
                    const minPrice = Math.min(...item.currentTrend);
                    const range = maxPrice - minPrice || 1;
                    const heightPercent = ((price - minPrice) / range) * 100;
                    return (
                      <div
                        key={idx}
                        className={`w-1 rounded-sm transition-all duration-350`}
                        style={{
                          height: `${Math.max(15, heightPercent)}%`,
                          backgroundColor: isUp ? "#22C55E" : "#EF4444",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Current Robux Price */}
                <div className="text-right shrink-0">
                  <div className="font-mono text-xs sm:text-sm font-bold text-neutral-100">
                    {formatRobux(item.estimatedRobux)} R$
                  </div>
                  <div className="flex items-center justify-end text-[9px]">
                    {isUp ? (
                      <span className="text-green-500 font-mono flex items-center gap-0.5 font-bold">
                        <TrendingUp className="w-2.5 h-2.5" /> {language === "th" ? "ขึ้น" : "Up"}
                      </span>
                    ) : (
                      <span className="text-red-500 font-mono flex items-center gap-0.5 font-bold">
                        <TrendingDown className="w-2.5 h-2.5" /> {language === "th" ? "ลง" : "Down"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={balance < item.estimatedRobux}
                    className="p-1.5 rounded-lg bg-green-950/40 border border-green-800 text-green-400 hover:bg-green-800 hover:text-white disabled:opacity-30 disabled:hover:bg-green-950/40 disabled:hover:text-green-400 cursor-pointer"
                    title={language === "th" ? "ซื้อ 1 ชิ้น" : "Buy 1 Quantity"}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSell(item)}
                    disabled={owned <= 0}
                    className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#2d1111] border border-red-900 text-red-400 hover:bg-red-950 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title={language === "th" ? "ขาย 1 ชิ้น" : "Sell 1 Quantity"}
                  >
                    {language === "th" ? "ขาย" : "Sell"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Logs and news tickers */}
      <div className="mt-4 bg-[#0d0d0d] p-2.5 rounded-lg border border-neutral-900 font-mono text-[9px]">
        <div className="text-neutral-500 uppercase font-mono tracking-wider mb-1">
          {language === "th" ? "กระดานจดบันทึกราคาหลัก:" : "Exchange Feed Log:"}
        </div>
        <div className="space-y-1 h-[45px] overflow-y-auto">
          {marketTrendLogs.map((log, idx) => (
            <div key={idx} className="text-neutral-300 leading-tight">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
