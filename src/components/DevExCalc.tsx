import React, { useState } from "react";
import { Coins, HelpCircle, DollarSign, ArrowRight } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

export default function DevExCalc() {
  const { language, t } = useLanguage();
  const [robuxInput, setRobuxInput] = useState<number>(100000);
  const [rateYear, setRateYear] = useState<"25" | "35">("35");

  const exchangeRate = rateYear === "25" ? 0.0025 : 0.0035;
  const cashValue = robuxInput * exchangeRate;

  // Formatting helper
  const formatCash = (val: number) => {
    return new Intl.NumberFormat(language === "th" ? "th-TH" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  const formatRobux = (val: number) => {
    return new Intl.NumberFormat(language === "th" ? "th-TH" : "en-US").format(val);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRobuxInput(Number(e.target.value));
  };

  return (
    <div id="devex-calculator-card" className="card-gradient p-6 rounded-xl shadow-xl overflow-hidden relative border border-neutral-850">
      <div className="absolute top-0 right-0 bg-red-600/10 text-red-500 font-mono text-[9px] tracking-wider px-3 py-1 rounded-bl-lg border-l border-b border-red-500/20 uppercase font-black">
        {language === "th" ? "เครื่องมือเศรษฐกิจอินเตอร์แอคทีฟ" : "INTERACTIVE ECONOMY SIMULATOR"}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Coins className="w-5 h-5 text-red-500" />
        <h4 className="font-display font-semibold text-lg text-white">
          {t("devex_title")}
        </h4>
      </div>

      <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
        {language === "th" 
          ? "จำลองการแลกมูลค่าเงินจริงโปรแกรม DevEx ของผู้ผลิตศึกษาความมั่นคง และดูอิทธิพลของอัตราการแลกเปลี่ยนที่มีต่อมูลค่าทางเศรษฐกิจในฐานะนักพัฒนา"
          : "Simulate Roblox's professional developer exchange program (DevEx) payouts. Observe how conversion rates dramatically influence real-world developer economics."
        }
      </p>

      {/* Inputs Grid */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {t("devex_target_amt")}
            </label>
            <span className="text-sm font-mono font-bold text-red-400">
              {formatRobux(robuxInput)} Robux
            </span>
          </div>

          <input
            type="range"
            min="30000"
            max="10000000"
            step="10000"
            value={robuxInput}
            onChange={handleSliderChange}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-650 accent-red-600 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
            <span>{language === "th" ? "30k (ขั้นต่ำ)" : "30k (Min Threshold)"}</span>
            <span>5M</span>
            <span>10M Robux</span>
          </div>
        </div>

        {/* Rate Year Selection */}
        <div>
          <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
            {language === "th" ? "โปรดเลือกช่วงยุคสมัยอัตราการแลกเปลี่ยน" : "Select DevEx Payout Rate Period"}
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRateYear("25")}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                rateYear === "225" || rateYear === "25"
                  ? "bg-red-950/30 border-red-600 text-white"
                  : "bg-[#181818] border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <div className="font-semibold text-xs sm:text-xs">
                {language === "th" ? "ยุคแรกคลาสสิก (2013)" : "2013 - Early Era Rate"}
              </div>
              <div className="text-[10px] font-mono mt-1 opacity-80">$0.0025 per Robux</div>
              <div className="text-[9px] italic text-neutral-500 mt-1">
                {language === "th" ? "เริ่มจำหน่ายปี 2013" : "Launched in 2013"}
              </div>
            </button>

            <button
              onClick={() => setRateYear("35")}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                rateYear === "35"
                  ? "bg-red-950/30 border-red-600 text-white"
                  : "bg-[#181818] border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              <div className="font-semibold text-xs sm:text-xs">
                {language === "th" ? "อัตรายุคปัจจุบันขยาย" : "Modern Extended Rate"}
              </div>
              <div className="text-[10px] font-mono mt-1 opacity-80">$0.0035 per Robux</div>
              <div className="text-[9px] italic text-neutral-500 mt-1">
                {language === "th" ? "อัตราผู้ผลิตยุคโมเดิร์น" : "Standard modern payout rate"}
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Result Visualizer */}
        <div className="bg-[#181818] p-4 rounded-xl border border-neutral-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full text-center md:text-left">
            <span className="text-[9px] text-neutral-500 uppercase font-mono block">
              {t("devex_cash_val")}
            </span>
            <span className="text-2xl font-display font-black text-green-500 flex items-center justify-center md:justify-start">
              <DollarSign className="w-5 h-5 shrink-0" />
              {formatCash(cashValue)}
            </span>
          </div>

          <div className="hidden md:flex shrink-0 items-center justify-center bg-neutral-900 rounded-full w-9 h-9 border border-neutral-800">
            <ArrowRight className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="w-full text-center md:text-right bg-neutral-900/55 p-2 rounded-lg">
            <div className="text-[9px] text-neutral-500 uppercase font-mono mb-0.5">
              {language === "th" ? "การประเมินอาชีพ" : "Empowerment Analysis"}
            </div>
            <div className="text-xs text-neutral-300 font-semibold h-[24px] flex items-center justify-center md:justify-end">
              {cashValue < 1000 ? (
                language === "th" ? "รายได้กลุ่มงานอดิเรก" : "Passionate Hobbyist Income"
              ) : cashValue < 10000 ? (
                language === "th" ? "รายได้จุนเจือนักพัฒนาอิสระ" : "Excellent Independent App Supplement"
              ) : cashValue < 30000 ? (
                language === "th" ? "รายได้หลักของฟรีแลนซ์ระดับโปร" : "Substantial Full-Time Freelancer Pay"
              ) : (
                language === "th" ? "สเกลสตูดีโอบริษัทผู้ผลิตรายใหญ่" : "Professional Multi-person Game Studio Scale"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
