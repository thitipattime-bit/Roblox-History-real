import React, { useState, useEffect } from "react";
import { HelpCircle, Check, X, RotateCcw, Trophy, Award, ArrowRight } from "lucide-react";
import { LOCALIZED_QUIZ } from "../lib/translations";
import { RobloxUser } from "./UserAuth";
import { useLanguage } from "../lib/LanguageContext";

interface HistoryQuizProps {
  currentUser?: RobloxUser | null;
  adjustUserRobux?: (amount: number) => void;
  onOpenAuth?: () => void;
}

export default function HistoryQuiz({ currentUser, adjustUserRobux, onOpenAuth }: HistoryQuizProps) {
  const { language, t } = useLanguage();
  const quizQuestions = LOCALIZED_QUIZ(language);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [earnedBonus, setEarnedBonus] = useState<boolean>(false);
  const [recentScores, setRecentScores] = useState<any[]>([]);

  // Listen to community high scores synced in real time via Google Cloud Firestore
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;
    let unsubscribe: (() => void) | undefined;

    const setupOnSnapshot = async () => {
      try {
        const { collection, query, orderBy, limit, onSnapshot } = await import("firebase/firestore");
        const { db, handleFirestoreError, OperationType } = await import("../lib/firebase");
        
        const q = query(
          collection(db, "quiz_scores"),
          orderBy("completedAt", "desc"),
          limit(5)
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetched: any[] = [];
          snapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
          });
          setRecentScores(fetched);
        }, (error) => {
          console.error("Firestore leaderboard feed subscription warning (non-fatal):", error);
        });
      } catch (e) {
        console.error("Failed to sync leaderboard query snap:", e);
      }
    };

    setupOnSnapshot();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Handle option select
  const currentQuestion = quizQuestions[currentIdx];

  const handleOptionSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(optionIdx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOpt === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
      // Reward user with 10,000 Robux per correct answer!
      if (adjustUserRobux) {
        adjustUserRobux(10000);
        setEarnedBonus(true);
      }
    } else {
      setEarnedBonus(false);
    }
  };

  const handleNext = async () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      if (currentUser && currentUser.uid) {
        try {
          const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
          const { db } = await import("../lib/firebase");
          await addDoc(collection(db, "quiz_scores"), {
            uid: currentUser.uid,
            username: currentUser.username,
            score: score,
            totalQuestions: quizQuestions.length,
            completedAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Failed to write quiz score to cloud storage:", error);
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Get score appraisal title
  const getRank = () => {
    if (score === quizQuestions.length) {
      return {
        name: language === "th" ? "จอมสถาปนิกที่ปรึกษาอาวุโส 👑" : "Consul Lead Architect 👑",
        desc: language === "th" 
          ? "คุณคืออัจฉริยะรู้ลึก รู้จริง เรื่องกลไกรหัส การสร้างเศรษฐกิจเสมือน และโครงสร้างระบบ Roblox" 
          : "Absolute master of Roblox mechanics, deep history, and infrastructure systems."
      };
    }
    if (score >= 3) {
      return {
        name: language === "th" ? "พ่อค้าเก็งกำไรลิมิเตด 📈" : "RBLX Exchange Trader 📈",
        desc: language === "th"
          ? "มีความเข้าใจยอดเยี่ยมเกี่ยวกับหลักเศรษฐกิจ ระบบหมุนเวียน และช่วงจุดสูงสุดสำคัญของแพลตฟอร์ม"
          : "Great understanding of the platform's economies, shifts, and high points."
      };
    }
    return {
      name: language === "th" ? "ผู้ฝีกหัดคลาสสิกแซนด์บ็อกซ์ 🧱" : "Classic Sandbox Noob 🧱",
      desc: language === "th"
        ? "การเริ่มต้นที่เยี่ยมยอด! แนะนำลองทบทวนข้อมูลในสไลด์จดหมายเหตุเล่มสมบูรณ์เพื่อสะสมความรู้เพิ่ม"
        : "A great start! Re-read the volumes to build your platform knowledge."
    };
  };

  return (
    <div id="trivia-quiz-interactive-card" className="card-gradient p-5 rounded-xl shadow-2xl relative overflow-hidden border border-neutral-850">
      <div className="absolute top-0 right-0 bg-red-600/10 text-red-500 font-mono text-[9px] tracking-wider px-3 py-1 rounded-bl-lg border-l border-b border-red-500/20 uppercase font-black">
        {language === "th" ? "ประวัติศาสาตร์เชิงลึก 20 ปี" : "INTERACTIVE RETRO TRIVIA"}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-red-500" />
        <h4 className="font-display font-semibold text-lg text-white">
          {t("quiz_title")}
        </h4>
      </div>

      {currentUser ? (
        <div className="mb-4 bg-red-950/20 border border-red-500/10 p-2 text-[10px] rounded flex items-center justify-between font-mono text-neutral-300">
          <span>{language === "th" ? "ลงชื่อใช้โดย: " : "Logged in as: "}<strong className="text-white">{currentUser.username}</strong></span>
          <span className="text-green-500 font-bold">{language === "th" ? "+10,000 R$ ต่อข้อที่ถูก" : "10,000 R$ PER CORRECT"}</span>
        </div>
      ) : (
        <div className="mb-4 bg-neutral-900/45 border border-neutral-900/60 p-2 text-[10px] rounded flex items-center justify-between font-mono text-neutral-400">
          <span>{language === "th" ? "ลงชื่อใช้เพื่อเครม 10K Robux ฟรีเมื่อตอบถูก!" : "Sign in to claim 10K Robux per question!"}</span>
          <button 
            type="button"
            onClick={onOpenAuth}
            className="text-red-500 hover:text-red-400 font-bold uppercase underline shrink-0 cursor-pointer"
          >
            {language === "th" ? "เข้าระบบ" : "Sign In"}
          </button>
        </div>
      )}

      {!quizFinished ? (
        <div>
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-4 text-[10px] font-mono text-neutral-400">
            <span className="uppercase">{t("quiz_state", [currentIdx + 1, quizQuestions.length])}</span>
            <span className="text-red-500 font-bold">{language === "th" ? "คะแนนของคุณ: " : "SCORE: "}{score}</span>
          </div>

          {/* Question Text */}
          <p className="font-semibold text-sm md:text-base text-neutral-100 mb-5 leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Options list */}
          <div className="space-y-2.5 mb-5">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "bg-[#181818] border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-[#1d1d1d]";

              if (selectedOpt === idx) {
                btnClass = "bg-red-950/20 border-red-600/60 text-red-100";
              }

              if (isSubmitted) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnClass = "bg-green-950/20 border-green-600 text-green-200 font-semibold";
                } else if (selectedOpt === idx) {
                  btnClass = "bg-red-950/40 border-red-600 text-red-300";
                } else {
                  btnClass = "bg-[#141414] border-neutral-900 text-neutral-550 cursor-not-allowed text-neutral-500";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isSubmitted}
                  className={`w-full p-3 rounded-lg border text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnClass}`}
                >
                  <span className="flex-1">{option}</span>
                  {isSubmitted && idx === currentQuestion.correctAnswerIndex && (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                  {isSubmitted && selectedOpt === idx && idx !== currentQuestion.correctAnswerIndex && (
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive submit or next action triggers */}
          <div className="space-y-4">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOpt === null}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {t("quiz_check_btn")}
              </button>
            ) : (
              <div className="space-y-4">
                {/* Out explanation block */}
                <div className="bg-[#0b0c10] border border-neutral-850 p-3.5 rounded-lg text-xs leading-relaxed text-zinc-300">
                  <div className="font-bold text-neutral-100 mb-1 flex items-center justify-between">
                    {selectedOpt === currentQuestion.correctAnswerIndex ? (
                      <span className="text-green-500 font-bold">{t("quiz_correct")}</span>
                    ) : (
                      <span className="text-red-500 font-bold">{t("quiz_incorrect")}</span>
                    )}
                    
                    {selectedOpt === currentQuestion.correctAnswerIndex && currentUser && (
                      <span className="text-[9px] text-yellow-400 font-mono font-bold uppercase tracking-wider bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-700/20">
                        {language === "th" ? "+ R$ 10,000 รางวัลเครดิต" : "+ R$ 10,000 Robux Reward"}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-red-400 font-mono font-bold uppercase mb-1">{t("quiz_explanation_hdr")}</div>
                  <p className="text-neutral-300 font-sans leading-relaxed">{currentQuestion.explanation}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  {currentIdx + 1 < quizQuestions.length ? t("quiz_next") : (language === "th" ? "ดูผลวิเคราะห์สรุปทั้งหมด" : "SEE SUMMARY RESULTS")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center bg-red-950/20 w-16 h-16 rounded-full border border-red-500/30 mb-4 text-red-500">
            <Trophy className="w-8 h-8" />
          </div>

          <h5 className="font-display font-bold text-xl text-white mb-1">
            {t("quiz_finished_hdr")}
          </h5>
          <p className="text-sm text-neutral-400 mb-4">
            {t("quiz_finished_raw", [score, quizQuestions.length])}
          </p>

          <div className="bg-[#181818] p-4 rounded-xl border border-neutral-800 mb-6 text-center max-w-sm mx-auto">
            <span className="text-[9px] text-neutral-500 uppercase font-mono block">
              {language === "th" ? "จัดระดับความรอบรู้ที่ครอบครอง" : "Your Earned Platform rank"}
            </span>
            <span className="text-base sm:text-lg font-display font-extrabold text-red-400 block mt-1">
              {getRank().name}
            </span>
            <span className="text-xs text-neutral-400 block mt-2 leading-relaxed font-sans">
              {getRank().desc}
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-red-650 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t("quiz_restart")}
          </button>

          {recentScores.length > 0 && (
            <div className="mt-8 border-t border-neutral-900 pt-6 text-left max-w-md mx-auto">
              <span className="text-[10px] font-mono font-black text-red-500 uppercase tracking-widest block mb-3 text-center sm:text-left">
                🌐 {language === "th" ? "ข้อมูลส่งขึ้นระบบสดประสาน Firestore" : "Real-Time Cloud Submissions (Google Firestore)"}
              </span>
              <div className="space-y-2">
                {recentScores.map((scoreObj, sIdx) => (
                  <div key={scoreObj.id || sIdx} className="flex items-center justify-between bg-neutral-950 border border-neutral-900 px-3.5 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="font-mono text-zinc-300 font-bold truncate max-w-[140px]">{scoreObj.username}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-red-500 font-extrabold">{scoreObj.score}/{scoreObj.totalQuestions}</span>
                      <span className="text-neutral-700 text-[10px]">•</span>
                      <span className="text-[10px] text-green-500 bg-green-950/20 px-1.5 py-0.5 rounded border border-green-900/10 font-bold font-sans">
                        + R$ {(scoreObj.score * 10000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
