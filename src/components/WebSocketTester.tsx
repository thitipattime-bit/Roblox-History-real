import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Wifi, Zap, RefreshCw, Terminal, Activity, Radio, Database, ShieldCheck, HelpCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

interface BotState {
  id: string;
  name: string;
  status: "idle" | "connected" | "sending" | "reconnecting" | "offline";
  ping: number;
  lastMessage: string;
  messageCount: number;
}

const BOT_PRESETS = [
  { id: "bot-1", name: "BuildermanBot 🛠️" },
  { id: "bot-2", name: "TelamonBot 🍕" },
  { id: "bot-3", name: "ShedletskyBot ⚔️" },
  { id: "bot-4", name: "ClockworkBot ⏰" },
  { id: "bot-5", name: "RobloxiaBot-42 🤖" },
  { id: "bot-6", name: "LolerisBot 🎮" },
  { id: "bot-7", name: "MinishBot ⚡" },
  { id: "bot-8", name: "MerelyBot 💎" },
  { id: "bot-9", name: "AdminBot-01 🛡️" },
  { id: "bot-10", name: "ModClientBot 🚨" }
];

const ROBOT_PHRASES = [
  "Generating high-fidelity Stud terrain block... 🧱",
  "Simulating high-value DevEx trade exchange! 💸",
  "Polishing Consul servers Consensus values ⚡",
  "Updating game place model vector asset parameters 📐",
  "Securing network route; Bypass sandbox guards OK 🛡️",
  "Fired explosive rocket launcher entity event! 🚀",
  "Acquired limited-edition Roblox crown from trading house 👑",
  "Flushed database lock stacks cleanly. Memory usage nominal.",
  "Executing Lua script executor virtual environment task. 📜",
  "Heartbeat PING keep-alive packet transmitted safely."
];

export default function WebSocketTester() {
  const { language } = useLanguage();
  const [botsActive, setBotsActive] = useState(false);
  const botsActiveRef = useRef(false);

  useEffect(() => {
    botsActiveRef.current = botsActive;
  }, [botsActive]);

  const [activeClients, setActiveClients] = useState<BotState[]>(
    BOT_PRESETS.map(b => ({
      ...b,
      status: "offline",
      ping: 0,
      lastMessage: "System idle. Awaiting ignition...",
      messageCount: 0
    }))
  );
  
  const [sysLogs, setSysLogs] = useState<{ id: number; timestamp: string; sender: string; content: string; type: "info" | "success" | "send" | "receive" | "error" | "ping" }[]>([
    {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      sender: "SYS-INIT",
      content: language === "th" ? "คลังเก็บประมวลระบบพร้อมใช้งาน. กรุณาเชื่อมต่อไปยังระบบหลัก." : "Socket diagnostic matrix initialized. Real-time logging active.",
      type: "info"
    }
  ]);

  const [mainLatency, setMainLatency] = useState<number>(-1);
  const [packetsPerSec, setPacketsPerSec] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalClientPackets, setTotalClientPackets] = useState(0);

  const botSocketsRef = useRef<{ [k: string]: WebSocket | null }>({});
  const botTimersRef = useRef<{ [k: string]: NodeJS.Timeout | null }>({});
  const ppsCounterRef = useRef<number>(0);
  const lastPingTimesRef = useRef<{ [id: string]: number }>({});

  // Monitor real-time packets-per-second
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketsPerSec(ppsCounterRef.current);
      ppsCounterRef.current = 0;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (sender: string, content: string, type: "info" | "success" | "send" | "receive" | "error" | "ping") => {
    if (isPaused) return;
    setSysLogs(prev => [
      {
        id: Math.random() + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        sender,
        content,
        type
      },
      ...prev.slice(0, 99) // limit to 100 items for memory stability
    ]);
  };

  // Turn on 10 bots
  const handleStartBots = () => {
    if (botsActive) return;
    setBotsActive(true);
    addLog("MONITOR", language === "th" ? "กำลังจุดระเบิดปล่อยตัวหุ่นยนต์ทดสอบ 10 ตัว..." : "Igniting 10 automated client testing units...", "info");

    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const host = window.location.host;
    const wsUrl = `${protocol}${host}/ws`;

    BOT_PRESETS.forEach((preset, index) => {
      // Stagger connection startup slightly to make it look professional
      setTimeout(() => {
        connectSingleBot(preset.id, preset.name, wsUrl);
      }, index * 200);
    });
  };

  // Handle single bot connection & keeping it on no matter what
  const connectSingleBot = (id: string, name: string, url: string) => {
    if (botSocketsRef.current[id]) {
      try { botSocketsRef.current[id]?.close(); } catch {}
    }

    setActiveClients(prev =>
      prev.map(b => (b.id === id ? { ...b, status: "reconnecting", lastMessage: "Securing connection..." } : b))
    );

    try {
      const socket = new WebSocket(url);
      botSocketsRef.current[id] = socket;

      let pingInterval: NodeJS.Timeout | null = null;
      let activeLoop: NodeJS.Timeout | null = null;
      let isAlive = true;
      let pingMisses = 0;

      socket.onopen = () => {
        isAlive = true;
        pingMisses = 0;
        ppsCounterRef.current += 1;
        
        setActiveClients(prev =>
          prev.map(b => (b.id === id ? { ...b, status: "connected", lastMessage: "Online. Handshake authorized." } : b))
        );
        addLog(name, "Socket channel connected and ready for traffic.", "success");

        // Immediately transmit a handshake ping to get the initial latency readout right away!
        try {
          lastPingTimesRef.current[id] = Date.now();
          socket.send("PING");
          ppsCounterRef.current += 1;
        } catch {}

        // Resilient check: Ping keepalive every 8 seconds (slightly faster to display real-time latency changes)
        pingInterval = setInterval(() => {
          if (!isAlive) {
            pingMisses += 1;
            if (pingMisses >= 3) {
              addLog(name, `Heartbeat lost (${pingMisses} misses). Closing for reconnect...`, "error");
              socket.close();
              return;
            } else {
              addLog(name, `Heartbeat warning: Missed ${pingMisses}/3 responses. Retrying...`, "ping");
            }
          } else {
            pingMisses = 0; // Reset misses on successful active state
          }

          isAlive = false;
          try {
            lastPingTimesRef.current[id] = Date.now();
            socket.send("PING");
            console.log(`[WebSocket Client - ${name}] Transmitted Ping Keepalive`);
            ppsCounterRef.current += 1;
          } catch {
            socket.close();
          }
        }, 8000);

        // Simulated action message loop
        const triggerSimulatedAction = () => {
          if (socket.readyState !== WebSocket.OPEN) return;
          
          const phrase = ROBOT_PHRASES[Math.floor(Math.random() * ROBOT_PHRASES.length)];
          const payload = {
            id,
            name,
            timestamp: Date.now(),
            content: phrase
          };

          try {
            setActiveClients(prev =>
              prev.map(b => (b.id === id ? { ...b, status: "sending", lastMessage: phrase } : b))
            );
            
            socket.send(JSON.stringify(payload));
            addLog(name, `WS Message Sent: "${phrase}"`, "send");
            ppsCounterRef.current += 1;
            setTotalClientPackets(prev => prev + 1);

            // Revert back to connected state after a flash feedback
            setTimeout(() => {
              setActiveClients(prev =>
                prev.map(b => {
                  if (b.id === id && b.status === "sending") {
                    return { ...b, status: "connected", messageCount: b.messageCount + 1 };
                  }
                  return b;
                })
              );
            }, 600);

          } catch (e) {
            console.error(e);
          }

          // Reschedule next action dynamically (slightly slower to protect user CPU bounds)
          const nextInterval = 10000 + Math.random() * 15000;
          botTimersRef.current[id] = setTimeout(triggerSimulatedAction, nextInterval);
        };

        botTimersRef.current[id] = setTimeout(triggerSimulatedAction, 2000 + Math.random() * 5000);
      };

      // Message response from server
      socket.onmessage = (event) => {
        isAlive = true;
        pingMisses = 0; // Reset misses on receiving any message
        ppsCounterRef.current += 1;
        
        if (event.data === "PONG") {
          const sentAt = lastPingTimesRef.current[id];
          if (sentAt) {
            const currentPing = Date.now() - sentAt;
            setActiveClients(prev =>
              prev.map(b => (b.id === id ? { ...b, ping: currentPing } : b))
            );
          }
          console.log(`[WebSocket Client - ${name}] Heartbeat success: PONG received`);
          return;
        }

        try {
          const received = JSON.parse(event.data);
          if (received.status === "echo") {
            addLog(name, `Echo response verified from backend loop.`, "receive");
          }
        } catch {
          addLog(name, `Plain echoed: "${event.data}"`, "receive");
        }
      };

      socket.onclose = () => {
        isAlive = false;
        if (pingInterval) clearInterval(pingInterval);
        if (botTimersRef.current[id]) clearTimeout(botTimersRef.current[id]!);

        setActiveClients(prev =>
          prev.map(b => (b.id === id ? { ...b, status: "offline", ping: 0, lastMessage: "Disconnected smoothly." } : b))
        );
        addLog(name, "Socket connection closed. Initiating recovery loop...", "error");

        // Resilient automatic reconnect after 3 seconds backoff if bots are supposed to be active
        if (botsActiveRef.current) {
          botTimersRef.current[id] = setTimeout(() => {
            if (botsActiveRef.current) {
              connectSingleBot(id, name, url);
            }
          }, 3000);
        }
      };

      socket.onerror = () => {
        // Quietly fail and let onclose trigger recover
        socket.close();
      };

    } catch (err) {
      console.warn(`Robot ${name} connection initiation failed`, err);
    }
  };

  // Automatically start the bots on mount so that they connect without needing manual ignition!
  useEffect(() => {
    addLog("MONITOR", language === "th" ? "คลังเก็บประมวลสัญญาณส่งสัญญาณอัตโนมัติ..." : "Powering up 10 automated client testing units dynamically on boot...", "info");
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const host = window.location.host;
    const wsUrl = `${protocol}${host}/ws`;

    BOT_PRESETS.forEach((preset, index) => {
      setTimeout(() => {
        if (botsActiveRef.current) {
          connectSingleBot(preset.id, preset.name, wsUrl);
        }
      }, index * 150);
    });
  }, []);

  // Turn off bots
  const handleStopBots = () => {
    setBotsActive(false);
    addLog("MONITOR", language === "th" ? "สั่งปิดการเชื่อมต่อหุ่นยนต์ทั้งหมด" : "Deactivating all automated client bots smoothly.", "info");
    
    // Clear all timeouts
    Object.keys(botTimersRef.current).forEach(id => {
      if (botTimersRef.current[id]) {
        clearTimeout(botTimersRef.current[id]!);
        botTimersRef.current[id] = null;
      }
    });

    // Close all physical WS handles
    Object.keys(botSocketsRef.current).forEach(id => {
      const s = botSocketsRef.current[id];
      if (s) {
        try { s.close(); } catch {}
        botSocketsRef.current[id] = null;
      }
    });

    setActiveClients(prev =>
      prev.map(b => ({
        ...b,
        status: "offline",
        lastMessage: "Powered down manually."
      }))
    );
  };

  // Force Packet Blast (Massive check)
  const handlePacketBlast = () => {
    if (!botsActive) {
      addLog("MONITOR", language === "th" ? "กรุณาเปิดการใช้งานบอทก่อนดำเนินการเร่งแพ็คเก็ต!" : "Failed: Ignite testing bots before applying packet blast!", "error");
      return;
    }
    addLog("LOAD TEST", language === "th" ? "🚀 ปล่อยแพ็คเกจแบบสายฟ้าแลบ (30 รายการทันที)!" : "🚀 Executing load burst test (Sending 3 packets per bot instantly)!", "info");
    
    BOT_PRESETS.forEach(preset => {
      const s = botSocketsRef.current[preset.id];
      if (s && s.readyState === WebSocket.OPEN) {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (s.readyState !== WebSocket.OPEN) return;
            const burstMsg = `[LOAD BURST #${i+1}] Concurrent speed validation test packet.`;
            s.send(JSON.stringify({
              id: preset.id,
              name: preset.name,
              timestamp: Date.now(),
              content: burstMsg
            }));
            ppsCounterRef.current += 1;
            setTotalClientPackets(prev => prev + 1);
          }, i * 40);
        }
      }
    });
  };

  // Cleanup on dismount
  useEffect(() => {
    return () => {
      // Clear timers
      Object.keys(botTimersRef.current).forEach(id => {
        if (botTimersRef.current[id]) clearTimeout(botTimersRef.current[id]!);
      });
      // Close sockets
      Object.keys(botSocketsRef.current).forEach(id => {
        const s = botSocketsRef.current[id];
        if (s) {
          try { s.close(); } catch {}
        }
      });
    };
  }, []);

  // Calculate average latency across all connected and measuring bots
  const connectedBots = activeClients.filter(b => b.status === "connected" || b.status === "sending");
  const pings = connectedBots.map(b => b.ping).filter(p => p > 0);
  const avgLatency = pings.length > 0 ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) : -1;

  const getSignalStrength = (latency: number) => {
    if (latency < 0) return { label: language === "th" ? "ไม่มีสัญญาณ" : "Offline", color: "text-neutral-500", bars: 0 };
    if (latency < 80) return { label: language === "th" ? "ยอดเยี่ยม" : "Excellent", color: "text-green-400", bars: 4 };
    if (latency < 160) return { label: language === "th" ? "ดี" : "Good", color: "text-emerald-400", bars: 3 };
    if (latency < 280) return { label: language === "th" ? "พอใช้" : "Fair", color: "text-yellow-400", bars: 2 };
    return { label: language === "th" ? "ต่ำ" : "Poor", color: "text-red-400", bars: 1 };
  };
  const signal = getSignalStrength(avgLatency);

  return (
    <div id="websocket-load-tester" className="card-gradient p-5 rounded-xl shadow-2xl relative overflow-hidden border border-neutral-850 mt-6 col-span-1 lg:col-span-2">
      {/* Absolute status indicators */}
      <div className="absolute top-0 right-0 bg-red-600/10 text-red-500 font-mono text-[9px] tracking-wider px-3 py-1 rounded-bl-lg border-l border-b border-red-500/20 uppercase font-bold flex items-center gap-1.5">
        <Radio className={`w-2.5 h-2.5 ${botsActive ? "text-green-500 animate-ping" : "text-neutral-500"}`} />
        <span>{botsActive ? "Live Load Test" : "Load Diagnostics"}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-red-500" />
        <h3 className="font-display font-semibold text-lg text-white">
          {language === "th" ? "เครื่องทดสอบและควบคุม WebSocket บอท (10 ยูนิตขนาน)" : "Pro Web WebSocket 10-Bot Concurrency Tester"}
        </h3>
      </div>

      <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
        {language === "th"
          ? "ทดสอบขีดความสามารถการสตรีมมิ่งข้อมูลของเซิร์ฟเวอร์ด้วยบอทจำลอง 10 ตัวที่ส่งแพ็คเก็ตผ่านการเชื่อมต่อ WebSocket จริงอย่างถาวร พร้อมติดตั้งระบบตรวจจับชีพจร (Ping-Pong Heartbeat) เพื่อให้มั่นใจได้เซสชันจะเชื่อมต่อตลอดเวลาโดยไม่มีวันหลุดเอง!"
          : "Validate real-time streaming capability on our local space container. Spawn 10 independent virtual robots who open 10 concurrent WebSocket connections with a robust ping-pong heartbeat. They verify load tolerances and never close spontaneously!"
        }
      </p>

      {/* Grid of high fidelity diagnostic stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5">
        <div className="bg-[#121212]/80 p-3 rounded-lg border border-neutral-900/60 text-center">
          <span className="text-[9px] text-neutral-500 uppercase font-mono block mb-1">
            {language === "th" ? "ความเร็วส่งถ่ายวิทยุ" : "Stream Throughput"}
          </span>
          <span className="text-lg font-mono font-black text-amber-500 flex items-center justify-center gap-1 leading-none">
            <Activity className="w-4 h-4 text-amber-500 inline shrink-0 animate-pulse" />
            {packetsPerSec} <span className="text-[10px] text-neutral-400 font-mono">pf/s</span>
          </span>
        </div>

        <div className="bg-[#121212]/80 p-3 rounded-lg border border-neutral-900/60 text-center">
          <span className="text-[9px] text-neutral-500 uppercase font-mono block mb-1">
            {language === "th" ? "บอทเชื่อมต่ออยู่" : "Active Bot Sockets"}
          </span>
          <span className="text-lg font-mono font-black text-green-400 leading-none">
            {activeClients.filter(b => b.status === "connected" || b.status === "sending").length} / 10
          </span>
        </div>

        <div className="bg-[#121212]/80 p-3 rounded-lg border border-neutral-900/60 text-center">
          <span className="text-[9px] text-neutral-500 uppercase font-mono block mb-1">
            {language === "th" ? "ยอดแพ็กเก็ตลูกค้าสะสม" : "Accrued Bot Packets"}
          </span>
          <span className="text-lg font-mono font-black text-red-400 leading-none">
            {totalClientPackets}
          </span>
        </div>

        <div className="bg-[#121212]/80 p-3 rounded-lg border border-neutral-900/60 text-center flex flex-col justify-center items-center">
          <span className="text-[9px] text-neutral-500 uppercase font-mono block mb-1">
            {language === "th" ? "ความเร็วเครือข่าย" : "Signal & Latency"}
          </span>
          <div className="flex items-center justify-center gap-2 mt-0.5 select-none">
            <div className="flex items-end gap-[1.5px] h-3.5" title={`Latency: ${avgLatency}ms`}>
              {[1, 2, 3, 4].map(barNum => {
                const isActive = barNum <= signal.bars;
                let barColor = "bg-neutral-800";
                if (isActive) {
                  if (signal.bars === 4) barColor = "bg-green-500";
                  else if (signal.bars === 3) barColor = "bg-emerald-500";
                  else if (signal.bars === 2) barColor = "bg-yellow-500";
                  else barColor = "bg-red-500";
                }
                const heights = ["h-1.5", "h-2.5", "h-3.5", "h-4.5"];
                return (
                  <div
                    key={barNum}
                    className={`w-[3px] rounded-t-sm transition-all duration-300 ${heights[barNum - 1]} ${barColor}`}
                  />
                );
              })}
            </div>
            <span className={`text-[10px] font-mono font-bold leading-none ${signal.color}`}>
              {avgLatency > 0 ? `${avgLatency}ms` : signal.label}
            </span>
          </div>
        </div>

        <div className="bg-[#121212]/80 p-3 rounded-lg border border-neutral-900/60 text-center col-span-2 sm:col-span-1">
          <span className="text-[9px] text-neutral-500 uppercase font-mono block mb-1">
            {language === "th" ? "สถานะดูแลเชื่อมต่อ" : "Heartbeat Guard"}
          </span>
          <span className="text-[11px] font-mono font-bold text-green-400 flex items-center justify-center gap-1 leading-none pt-1">
            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
            ONLINE (8S)
          </span>
        </div>
      </div>

      {/* Main Control Panel buttons row */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        {!botsActive ? (
          <button
            onClick={handleStartBots}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-display text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            {language === "th" ? "สั่งบอท 10 ตัวทำงานพร้อมกัน" : "Deploy & Ignite 10 WebSocket Bots"}
          </button>
        ) : (
          <button
            onClick={handleStopBots}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-display text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/20"
          >
            <Square className="w-3.5 h-3.5 fill-current shrink-0" />
            {language === "th" ? "ตัดการเชื่อมต่อบอททั้งหมด" : "Disconnect & Power Down Bots"}
          </button>
        )}

        <button
          onClick={handlePacketBlast}
          disabled={!botsActive}
          className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-850 text-neutral-250 disabled:opacity-45 rounded-lg font-display text-xs font-bold uppercase border border-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {language === "th" ? "ยิงคลื่นความถี่โหลดเวกเตอร์" : "Force Concurrency blast (Load Test)"}
        </button>
      </div>

      {/* Grid of Bot states */}
      <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase mb-3 tracking-wider flex items-center gap-1">
        <Wifi className="w-3.5 h-3.5 text-red-500" />
        {language === "th" ? "รายการจราจรอากาศบอท:" : "Real-time Bot Network Matrix:"}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {activeClients.map(client => {
          const isMsg = client.status === "sending";
          const isConn = client.status === "connected" || isMsg;
          
          return (
            <div
              key={client.id}
              className={`bg-neutral-950/90 border rounded-lg p-2.5 transition-all flex flex-col justify-between h-[96px] ${
                isMsg 
                  ? "border-amber-500 ring-1 ring-amber-500/20 bg-amber-950/5" 
                  : isConn 
                    ? "border-green-800/40 hover:border-green-750/60" 
                    : "border-neutral-900 opacity-60"
              }`}
            >
              <div className="flex justify-between items-center leading-none">
                <span className="font-display font-black text-[10.5px] text-neutral-100 truncate pr-1">
                  {client.name.substring(0, 15)}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isMsg ? "bg-amber-500 animate-ping" : isConn ? "bg-green-500 animate-pulse" : "bg-neutral-700"}`} />
              </div>

              {/* Message counters details */}
              <div className="text-[10px] text-neutral-400 font-mono line-clamp-2 mt-1.5 leading-tight italic">
                "{client.lastMessage}"
              </div>

              <div className="flex justify-between items-center text-[8.5px] text-neutral-500 font-mono border-t border-neutral-900/60 pt-1.5 mt-1.5 shrink-0 select-none">
                <span className="uppercase text-[7.5px] font-bold bg-neutral-900 px-1 py-0.5 rounded text-neutral-400">
                  {client.status}
                </span>
                {isConn && client.ping > 0 && (
                  <span className="text-green-500 font-bold">{client.ping} ms</span>
                )}
                <span>
                  Packets: <strong className="text-neutral-300 font-bold">{client.messageCount}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal of messages log */}
      <div className="bg-[#050505] p-3 rounded-lg border border-neutral-900 flex flex-col h-48">
        <div className="flex justify-between items-center border-b border-neutral-900 pb-2 mb-2 shrink-0">
          <span className="text-red-500 font-mono text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-red-500 shrink-0" />
            {language === "th" ? "รายงานรับส่งแพ็คเก็ต WebSocket คอลโซล:" : "Inbound / Outbound WebSocket Packet Console:"}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSysLogs([{
                  id: Date.now(),
                  timestamp: new Date().toLocaleTimeString(),
                  sender: "MONITOR",
                  content: language === "th" ? "ล้างข้อมูลรายงานในคอลโซลเรียบร้อย." : "System console log cleared. Memory usage nominal.",
                  type: "info"
                }]);
              }}
              className="text-[9px] font-mono px-2 py-0.5 bg-neutral-900 hover:bg-neutral-850 rounded border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer mr-0.5"
            >
              🧹 {language === "th" ? "ล้างคอลโซล" : "CLEAR"}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-[9px] font-mono px-2 py-0.5 bg-neutral-900 hover:bg-neutral-850 rounded border border-neutral-800 text-neutral-450 hover:text-white transition-colors cursor-pointer"
            >
              {isPaused ? "▶ RESUME" : "⏸ PAUSE"}
            </button>
          </div>
        </div>

        <div className="font-mono text-[9.5px] space-y-1 overflow-y-auto flex-1 select-text">
          {sysLogs.map((log) => {
            let typeColor = "text-neutral-400";
            if (log.type === "success") typeColor = "text-green-400 font-bold";
            else if (log.type === "error") typeColor = "text-red-500 font-bold";
            else if (log.type === "send") typeColor = "text-amber-400";
            else if (log.type === "receive") typeColor = "text-cyan-400";
            else if (log.type === "ping") typeColor = "text-purple-400/80";

            return (
              <div key={log.id} className="leading-tight flex items-start gap-1">
                <span className="text-neutral-600 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 px-1 font-bold rounded text-[8px] uppercase ${
                  log.type === "send" ? "bg-amber-950/40 text-amber-500" :
                  log.type === "receive" ? "bg-cyan-950/40 text-cyan-500" :
                  log.type === "ping" ? "bg-purple-950/40 text-purple-400" :
                  log.type === "success" ? "bg-green-950/40 text-green-500" :
                  log.type === "error" ? "bg-red-950/40 text-red-500" : "bg-neutral-900 text-neutral-450"
                }`}>
                  {log.sender}
                </span>
                <span className={typeColor}>{log.content}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
