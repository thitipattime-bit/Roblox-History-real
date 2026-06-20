import React, { useState } from "react";
import { ShieldCheck, RefreshCw, CheckCircle2, RotateCw, AlertTriangle, HelpCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

interface BotVerificationProps {
  onVerifySuccess: () => void;
}

export default function BotVerification({ onVerifySuccess }: BotVerificationProps) {
  const { language, t } = useLanguage();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showChallenge, setShowChallenge] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(120); // starts mismatched
  const [captchaLogs, setCaptchaLogs] = useState<string>("Align the Roblox logo block upright.");
  const [errorCount, setErrorCount] = useState<number>(0);

  // Classic Roblox CAPTCHAS are infamous for rotating animals/items
  const rotateLeft = () => {
    setRotationAngle((prev) => (prev - 45 + 360) % 360);
  };

  const rotateRight = () => {
    setRotationAngle((prev) => (prev + 45) % 360);
  };

  const handleVerifySubmission = () => {
    // 0 is perfectly upright
    if (rotationAngle === 0) {
      setIsVerified(true);
      setCaptchaLogs("Verification fully authorized! Launching archives...");
      setTimeout(() => {
        onVerifySuccess();
      }, 1200);
    } else {
      setErrorCount((prev) => prev + 1);
      setCaptchaLogs("Verification failed. The alignment angle is incorrect. Try again!");
      // randomized reset
      setRotationAngle([90, 135, 180, 225, 270][Math.floor(Math.random() * 5)]);
    }
  };

  const handleCheckboxClick = () => {
    if (isVerified) return;
    setIsChecked(true);
    // Open verification challenge
    setTimeout(() => {
      setShowChallenge(true);
    }, 450);
  };

  const skipCaptcha = () => {
    setIsVerified(true);
    onVerifySuccess();
  };

  // Helper translations for localized state labels
  const getLocalizedLog = (log: string) => {
    if (log === "Align the Roblox logo block upright.") {
      return language === "th" ? "หมุนบล็อกโลโก้ Roblox ให้ตรงตั้งตรง" : "Align the Roblox logo block upright.";
    }
    if (log === "Verification failed. The alignment angle is incorrect. Try again!") {
      return language === "th" ? "สิทธิ์ล้มเหลว องศาการเล็งไม่ถูกต้อง ลองอีกครั้ง!" : "Verification failed. The alignment angle is incorrect. Try again!";
    }
    if (log === "Verification fully authorized! Launching archives...") {
      return language === "th" ? "ยืนยันสิทธิ์เรียบร้อยแล้ว! กำลังเข้าสู่สารบัญจดหมายเหตุ..." : "Verification fully authorized! Launching archives...";
    }
    return log;
  };

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      {/* High-quality background decorative neon glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-650/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="card-gradient rounded-2xl max-w-md w-full p-6 md:p-8 relative shadow-3xl text-left overflow-hidden border border-neutral-850">
        <div className="absolute top-0 right-0 bg-red-600/10 text-red-500 font-mono text-[9px] tracking-widest px-3 py-1 rounded-bl-lg border-l border-b border-red-500/20">
          SECURE SHIELD v2.4
        </div>

        {/* Captcha Logo details */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 bg-red-600 rounded-xl items-center justify-center font-black font-display text-xl shadow-lg shadow-red-950/40 text-white mb-3">
            R
          </div>
          <h2 className="font-display font-extrabold text-xl lg:text-2xl uppercase tracking-tight text-white">
            {t("bot_title")}
          </h2>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
            {t("bot_subtitle")}
          </p>
        </div>

        {!showChallenge ? (
          /* "I am not a robot" Checkbox Interface */
          <div className="bg-[#0b0b0c] border border-neutral-850 p-5 rounded-xl flex items-center justify-between transition-colors hover:border-neutral-800">
            <button
              onClick={handleCheckboxClick}
              disabled={isChecked}
              className="flex items-center gap-4 group text-left focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded border transition-all duration-300 flex items-center justify-center shrink-0 ${
                  isChecked
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-[#141415] border-neutral-750 group-hover:border-red-505 group-hover:border-red-500"
                }`}
              >
                {isChecked && <div className="w-2 h-3 border-r-2 border-b-2 border-white rotate-45 -mt-0.5" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-200 block group-hover:text-white transition-colors">
                  {language === "th" ? "ฉันไม่ใช่โปรแกรมอัตโนมัติ (บอต)" : "I am not a robot"}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 block">
                  {language === "th" ? "ประเมินความปลอดภัยสิทธิ์ผู้ใช้ประวัติศาสตร์" : "Verify platform credential authority"}
                </span>
              </div>
            </button>

            <div className="text-right flex flex-col items-end shrink-0">
              <ShieldCheck className="w-7 h-7 text-red-500/80 animate-pulse" />
              <span className="text-[9px] font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                FunCaptcha RBLX
              </span>
            </div>
          </div>
        ) : (
          /* Captcha Interactive Challenge Frame */
          <div className="space-y-6">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 text-center relative overflow-hidden">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wide mb-3 flex items-center justify-center gap-1">
                <HelpCircle className="w-3 h-3 text-red-500" />
                {getLocalizedLog(captchaLogs)}
              </div>

              {/* Challenge graphics */}
              <div className="my-8 flex justify-center items-center">
                <div
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                  className="w-24 h-24 bg-neutral-900 border-2 border-red-600/30 rounded-2xl flex items-center justify-center shadow-2xl relative transition-transform duration-300 cursor-pointer hover:border-red-500"
                  onClick={rotateRight}
                  title={language === "th" ? "คลิกเพื่อหมุน" : "Click to Rotate"}
                >
                  {/* Classic Roblox Block with center cutout */}
                  <div className="w-12 h-12 border-[6.5px] border-white rounded-lg rotate-15 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-sm" />
                  </div>

                  {/* Up pointer indicator anchor helper */}
                  <div className="absolute top-1 right-2 text-[8px] font-mono font-bold text-red-500/70 select-none">
                    RBLX
                  </div>
                </div>
              </div>

              {/* Action commands */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={rotateLeft}
                  className="p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 rounded-lg border border-neutral-850 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 scale-x-[-1]" /> {language === "th" ? "หมุนซ้าย" : "Rotate Left"}
                </button>
                <button
                  onClick={rotateRight}
                  className="p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 rounded-lg border border-neutral-850 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  {language === "th" ? "หมุนขวา" : "Rotate Right"} <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Submit verify or help indicators */}
            <div className="space-y-3">
              <button
                onClick={handleVerifySubmission}
                disabled={isVerified}
                className="w-full py-3 bg-red-605 bg-red-600 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-950/20"
              >
                {isVerified ? (language === "th" ? "ยืนยันเสร็จสิ้น..." : "ACCESS GRANTED...") : (language === "th" ? "เสร็จสิ้น / ส่งคำตอบขนาน" : "DONE / SUBMIT MATCH")}
              </button>

              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <span>
                  {language === "th" ? "ทำผิดพลาด: " : "Mistakes: "}<strong className="text-red-500">{errorCount}</strong>
                </span>
                <button
                  onClick={skipCaptcha}
                  className="text-neutral-500 hover:text-red-500 transition-colors"
                >
                  {language === "th" ? "ข้ามขั้นตอน (เวอร์ชันนักพัฒนาจำลอง)" : "Bypass Verification (Developer Demo)"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-900 text-[10px] text-center text-neutral-500 font-mono">
          {language === "th" ? "ระบบป้องกันภัยแบบรวมศูนย์ตรวจสอบโดยฟิตเจอร์เซิร์ฟเวอร์หลัก" : "Secured by Roblox Federated Authentication Servers"}
        </div>
      </div>
    </div>
  );
}
