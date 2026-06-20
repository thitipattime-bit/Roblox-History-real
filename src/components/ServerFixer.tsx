import React, { useState, useEffect } from "react";
import { Activity, WifiOff, RefreshCw, Layers, CheckCircle, ShieldAlert } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

export default function ServerFixer() {
  const { language, t } = useLanguage();
  const [burritoPromos, setBurritoPromos] = useState<number>(5); // 1-5
  const [consulNodes, setConsulNodes] = useState<number>(2); // 1-10
  const [dbBuffer, setDbBuffer] = useState<number>(30); // scale 0-100
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [clicksCount, setClicksCount] = useState<number>(0);
  
  const initialLogs = language === "th"
    ? [
        "วิกฤต: การคัดเลือกผู้นำโหนดล้มเหลว ณ ดาต้าเซ็นเตอร์ 'rblx-west-1'",
        "คำเตือน: ตรวจพบคอขวดในการจัดการและบีบอัดล็อกของโหนด Consul",
        "คิวคำร้องแคมเปญฟรี Chipotle Burrito: เกินขีดจำกัดแชนเนล 3,200 คำขอ/วินาที"
      ]
    : [
        "CRITICAL: Leader election failing in datacenter 'rblx-west-1'.",
        "WARNING: Consul raft log compaction bottleneck detected.",
        "Chipotle burritos request queue: 3,200 requests/sec limit saturated."
      ];

  const [logs, setLogs] = useState<string[]>(initialLogs);

  // Synchronize initial logs output on language change cleanly
  useEffect(() => {
    setLogs((prev) => {
      // Keep track of dynamically generated success/adjust logs if they happen, or just reset/refresh base logs
      if (isOnline) {
        return language === "th"
          ? [
              "สำเร็จ: ฉันทามติ Consul คืนเสถียรภาพเรียบร้อยแล้ว! 🎉",
              "ตรวจสอบความแข็งแรง: ทุกระบบไมโครเซอร์วิสรายงานค่าเป็นปกติ STATUS_OK",
              "Roblox กลับมาออนไลน์แล้ว! ผู้เล่นหลายสิบล้านคนเริ่ม ทยอยล็อกอินเข้าระบบ! 🚀"
            ]
          : [
              "SUCCESS: Consul raft consensus recovered successfully! 🎉",
              "HEALTH CHECK: All microservices reporting STATUS_OK.",
              "Roblox is back online! Millions of players are relogging. 🚀"
            ];
      }
      return language === "th"
        ? [
            "วิกฤต: การคัดเลือกผู้นำโหนดล้มเหลว ณ ดาต้าเซ็นเตอร์ 'rblx-west-1'",
            "คำเตือน: ตรวจพบคอขวดในการจัดการและบีบอัดล็อกของโหนด Consul",
            "คิวคำร้องแคมเปญฟรี Chipotle Burrito: เกินขีดจำกัดแชนเนล 3,200 คำขอ/วินาที"
          ]
        : [
            "CRITICAL: Leader election failing in datacenter 'rblx-west-1'.",
            "WARNING: Consul raft log compaction bottleneck detected.",
            "Chipotle burritos request queue: 3,200 requests/sec limit saturated."
          ];
    });
  }, [language, isOnline]);

  // Derived metrics
  const trafficLoad = burritoPromos * 22; // up to 110
  const processCapacity = consulNodes * 18 + dbBuffer * 0.4; // up to 220
  const clusterLoad = Math.max(5, Math.min(100, Math.floor((trafficLoad / (processCapacity || 1)) * 120)));

  // Check success condition
  useEffect(() => {
    if (clusterLoad < 45 && consulNodes >= 4 && dbBuffer > 40 && burritoPromos <= 2) {
      if (!isOnline) {
        setIsOnline(true);
        setLogs((prev) => {
          const successLogs = language === "th"
            ? [
                "สำเร็จ: ฉันทามติ Consul คืนเสถียรภาพเรียบร้อยแล้ว! 🎉",
                "ตรวจสอบความแข็งแรง: ทุกระบบไมโครเซอร์วิสรายงานค่าเป็นปกติ STATUS_OK",
                "Roblox กลับมาออนไลน์แล้ว! ผู้เล่นหลายสิบล้านคนเริ่ม ทยอยล็อกอินเข้าระบบ! 🚀"
              ]
            : [
                "SUCCESS: Consul raft consensus recovered successfully! 🎉",
                "HEALTH CHECK: All microservices reporting STATUS_OK.",
                "Roblox is back online! Millions of players are relogging. 🚀"
              ];
          return [...successLogs, ...prev];
        });
      }
    } else if (isOnline) {
      setIsOnline(false);
    }
  }, [clusterLoad, consulNodes, dbBuffer, burritoPromos]);

  const handlePrunePromos = () => {
    setBurritoPromos((prev) => Math.max(1, prev - 1));
    setClicksCount((prev) => prev + 1);
    const adjustText = language === "th"
      ? "ปรับปรุงแคมเปญ: ระงับแคมเปญแจกเบอร์ริโตฟรี คลายภาระแบนด์วิดท์เข้า"
      : "PROMOTION ADJUSTED: Paused concurrent free burrito campaigns. Incoming load reduced.";
    setLogs((prev) => [adjustText, ...prev.slice(0, 4)]);
  };

  const handleDistributeConsul = () => {
    setConsulNodes((prev) => Math.min(8, prev + 1));
    setDbBuffer((prev) => Math.max(10, prev - 8)); // Costs database memory buffer
    setClicksCount((prev) => prev + 1);
    const nodeText = language === "th"
      ? `เพิ่มโหนดสำเร็จ: ดำเนินการติดตั้งโหนดโฮสติ้งที่ #${consulNodes + 1} ยกระดับพลัง Raft Consensus`
      : `NODES ADDED: Launched virtual Consul node cluster #${consulNodes + 1}. Raft capacity upgraded.`;
    setLogs((prev) => [nodeText, ...prev.slice(0, 4)]);
  };

  const handleFlushDB = () => {
    setDbBuffer((prev) => Math.min(100, prev + 30));
    setClicksCount((prev) => prev + 1);
    const flushText = language === "th"
      ? "ล้างสารบบบฟเฟอร์: ลบแคชคีย์ล็อกที่ค้างคา และจัดลำดับอินเด็กซ์จัดดัชนีโหนดใหม่"
      : "FLUSH OPERATOR: Cleared stale database lock stacks and consolidated index nodes.";
    setLogs((prev) => [flushText, ...prev.slice(0, 4)]);
  };

  const resetOutage = () => {
    setBurritoPromos(5);
    setConsulNodes(2);
    setDbBuffer(30);
    setIsOnline(false);
    setClicksCount(0);
    setLogs(
      language === "th"
        ? [
            "วิกฤต: การคัดเลือกผู้นำโหนดล้มเหลว ณ ดาต้าเซ็นเตอร์ 'rblx-west-1'",
            "คำเตือน: คิวคำร้องแคมเปญฟรี Chipotle Burrito แน่นขนัดอย่างแรง"
          ]
        : [
            "CRITICAL: Leader election failing in datacenter 'rblx-west-1'.",
            "WARNING: Chipotle burritos request queue saturated."
          ]
    );
  };

  return (
    <div id="consul-cluster-card" className="card-gradient p-5 rounded-xl shadow-2xl relative overflow-hidden border border-neutral-850">
      <div className="absolute top-0 right-0 bg-red-600/10 text-red-500 font-mono text-[9px] tracking-wider px-3 py-1 rounded-bl-lg border-l border-b border-red-500/20 uppercase font-black">
        {language === "th" ? "จำลองเหตุการณ์ประวัติศาสตร์ 2021" : "OCTOBER 2021 SIMULATOR"}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Activity className={`w-5 h-5 ${isOnline ? "text-green-500" : "text-amber-500 animate-pulse"}`} />
        <h4 className="font-display font-semibold text-lg text-white">
          {language === "th" ? "เครื่องวินิจฉัยวิกฤตเซิร์ฟเวอร์ Chipotle" : "Chipotle Outage Diagnostic"}
        </h4>
      </div>

      <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
        {language === "th"
          ? "จำลองระบบล่มในประวัติศาสตร์ร่วม 48 ชั่วโมง! รับบทหัวหน้าทีมสถาปนิกโครงสร้างพื้นฐานจัดโหนด Consul บังคับคิว และกู้ระบบยักษ์ใหญ่กลับมาออนไลน์เรียบร้อย"
          : "Roblox has been down for 48 hours. Play the lead infrastructure architect to coordinate Consul settings, flush the lock pools, and get the platform back online."
        }
      </p>

      {/* Outage status meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-[#181818] p-3.5 rounded-lg border border-neutral-900/80 flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-neutral-500 uppercase font-mono block">
              {language === "th" ? "อัตราการรับงานคลัสเตอร์ Consul" : "Consul Cluster Load"}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-mono font-black ${clusterLoad > 80 ? "text-red-500" : clusterLoad > 45 ? "text-amber-500" : "text-green-500"}`}>
                {clusterLoad}%
              </span>
              <span className="text-xs text-neutral-400">{language === "th" ? "เป้าหมาย < 45%" : "Target < 45%"}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-350 ${clusterLoad > 80 ? "bg-red-500" : clusterLoad > 45 ? "bg-amber-500" : "bg-green-500"}`}
              style={{ width: `${clusterLoad}%` }}
            />
          </div>
        </div>

        <div className="bg-[#181818] p-3.5 rounded-lg border border-neutral-900/80 flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-neutral-500 uppercase font-mono block">
              {language === "th" ? "สถานะการทำงานปัจจุบัน" : "Status State"}
            </span>
            <div className="flex items-center gap-2 mt-2">
              {isOnline ? (
                <span className="px-2.5 py-0.5 bg-green-950/40 border border-green-800 text-green-400 font-mono text-xs font-bold rounded-full flex items-center gap-1.5 leading-none">
                  <CheckCircle className="w-3.5 h-3.5" /> SYSTEM_ONLINE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-red-950/40 border border-red-800 text-red-00 text-red-400 font-mono text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse leading-none">
                  <WifiOff className="w-3.5 h-3.5" /> SITE_CRITICAL_OFFLINE
                </span>
              )}
            </div>
          </div>
          <div className="text-[10px] text-neutral-400 mt-2">
            {language === "th" ? "ขั้นตอนควบคุมสะสม: " : "Tasks solved in draft: "} 
            <span className="text-white font-mono font-bold">{clicksCount}</span> {language === "th" ? "ครั้ง" : "adjustments"}
          </div>
        </div>
      </div>

      {/* Target specs display */}
      <div className="bg-[#0b0c10] border border-neutral-900 p-3 rounded-lg mb-4 text-xs space-y-1">
        <div className="font-semibold text-neutral-300">{language === "th" ? "เกณฑ์กู้คืนที่จำต้องบรรลุและเข้าเกณฑ์:" : "Target Objectives to Recover:"}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 font-mono text-[11px]">
          <span className={burritoPromos <= 2 ? "text-green-400 font-semibold" : "text-neutral-500"}>
            {language === "th" ? "• แคมเปญแจกเบอร์ริโต" : "• Burrito Promos"}: {burritoPromos} {language === "th" ? "(ต้องการ ≤ 2)" : "(Need ≤ 2)"}
          </span>
          <span className={consulNodes >= 4 ? "text-green-400 font-semibold" : "text-neutral-500"}>
            {language === "th" ? "• เซิร์ฟเวอร์หลักโหนด" : "• Consul Nodes"}: {consulNodes} {language === "th" ? "(ต้องการ ≥ 4)" : "(Need ≥ 4)"}
          </span>
          <span className={dbBuffer > 40 ? "text-green-400 font-semibold" : "text-neutral-500"}>
            {language === "th" ? "• ความต่างบัฟเฟอร์ DB" : "• DB Mem Buffer"}: {dbBuffer}% {language === "th" ? "(ต้องการ > 40%)" : "(Need > 40%)"}
          </span>
          <span className={clusterLoad < 45 ? "text-green-400 font-semibold" : "text-neutral-500"}>
            {language === "th" ? "• ภาระโหลดคลัสเตอร์รวม" : "• Total Cluster Load"}: {clusterLoad}% {language === "th" ? "(ต้องการ < 45%)" : "(Need < 45%)"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handlePrunePromos}
          disabled={isOnline}
          className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-850 active:bg-neutral-800 disabled:opacity-40 rounded-lg border border-neutral-800 text-[10px] sm:text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
        >
          {language === "th" ? "ระงับจัดโปรโมชั่น Chipotle" : "Prune Burrito Promos"}
        </button>

        <button
          onClick={handleDistributeConsul}
          disabled={isOnline}
          className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-850 active:bg-neutral-800 disabled:opacity-40 rounded-lg border border-neutral-800 text-[10px] sm:text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
        >
          {language === "th" ? "เพิ่มโหนดหลัก (+Raft Node)" : "Add Consul Node (+Raft)"}
        </button>

        <button
          onClick={handleFlushDB}
          disabled={isOnline}
          className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-850 active:bg-neutral-850 disabled:opacity-40 rounded-lg border border-neutral-800 text-[10px] sm:text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
        >
          {language === "th" ? "เคลียร์ล็อกพูลฐานข้อมูล" : "Flush DB Lock Pool"}
        </button>
      </div>

      {/* Mini diagnostic console view */}
      <div className="bg-[#050505] p-3 rounded-lg border border-neutral-900/80 font-mono text-[9px] space-y-1 h-32 overflow-y-auto">
        <div className="text-red-500 uppercase tracking-wider mb-1.5 shrink-0 flex items-center justify-between font-bold">
          <span>{language === "th" ? "คอนโซลกระแสการประมวลผลระบบ:" : "Engine Output Console:"}</span>
          {isOnline && <span className="text-green-500 animate-pulse font-black">{language === "th" ? "กู้ระบบสมบูรณ์" : "RECOVERED"}</span>}
        </div>
        {logs.map((log, index) => {
          let colorClass = "text-neutral-400";
          if (log.startsWith("CRITICAL") || log.startsWith("วิกฤต")) colorClass = "text-red-500 font-semibold";
          else if (log.startsWith("WARNING") || log.startsWith("คำเตือน")) colorClass = "text-amber-500";
          else if (log.startsWith("SUCCESS") || log.startsWith("สำเร็จ")) colorClass = "text-green-400 font-semibold";
          else if (log.startsWith("HEALTH") || log.startsWith("ตรวจสอบความแข็งแรง")) colorClass = "text-green-500";
          return (
            <div key={index} className={`${colorClass} leading-tight`}>
              &gt; {log}
            </div>
          );
        })}
      </div>

      {/* Reset options */}
      {isOnline && (
        <button
          onClick={resetOutage}
          className="mt-3 text-center w-full py-2 bg-neutral-900 text-neutral-400 text-[10px] sm:text-xs hover:text-white rounded border border-neutral-800 transition-colors cursor-pointer"
        >
          {language === "th" ? "เริ่มจำลองวิกฤตระบบขัดข้องอีกรอบ (เริ่มใหม่)" : "Reset Outage Simulator (Re-simulate Breakdown)"}
        </button>
      )}
    </div>
  );
}
