import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, Volume2, VolumeX, ShieldCheck, Gamepad2, Disc, Radio, RefreshCw, Smartphone, Sparkles, AlertCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

interface Song {
  id: string;
  assetId: string;
  title: string;
  composer: string;
  year: string;
  url: string;
  fallbackUrl: string;
  fact: string;
}

const SONG_PLAYLIST: Song[] = [
  {
    id: "raining-tacos",
    assetId: "142376446",
    title: "It's Raining Tacos 🌮",
    composer: "Parry Gripp",
    year: "2012",
    url: "https://archive.org/download/its-raining-tacos/its-raining-tacos.mp3",
    fallbackUrl: "https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptrackid=275219",
    fact: "The ultimate peak of old school Roblox boombox culture! Played in cafes, build games, and natural disaster survival places."
  },
  {
    id: "wind-of-fjords",
    assetId: "142647306",
    title: "Wind of Fjords ⚔️",
    composer: "Starry",
    year: "2006",
    url: "https://archive.org/download/roblox_old_songs/Wind%20of%20Fjords.mp3",
    fallbackUrl: "https://archive.org/download/roblox_old_songs/Wind%2520of%2520Fjords.mp3",
    fact: "Legendary sword fight anthem. Instantly primes anyone for combat on Crossroads or Chaos Canyon!"
  },
  {
    id: "great-strategy",
    assetId: "142750669",
    title: "The Great Strategy 🛡️",
    composer: "Badlion",
    year: "2008",
    url: "https://archive.org/download/roblox_old_songs/The%20Great%20Strategy.mp3",
    fallbackUrl: "https://archive.org/download/roblox_old_songs/The%2520Great%2520Strategy.mp3",
    fact: "Eerie background track that represents high-stakes tactical military clan fort defense campaigns."
  },
  {
    id: "roblox-anthem",
    assetId: "125124400",
    title: "Roblox Anthem (2007) 🎷",
    composer: "Classical Archive",
    year: "2007",
    url: "https://archive.org/download/roblox_old_songs/Roblox%20Theme.mp3",
    fallbackUrl: "https://archive.org/download/roblox_old_songs/Roblox%2520Theme.mp3",
    fact: "The cozy client startup music we all heard in childhood before joining our first empty baseplate."
  },
  {
    id: "mule-theme",
    assetId: "184311094",
    title: "M.U.L.E. Theme 🍕",
    composer: "Roy Glover",
    year: "1983",
    url: "https://archive.org/download/roblox_old_songs/M.U.L.E..mp3",
    fallbackUrl: "https://archive.org/download/roblox_old_songs/M.U.L.E..mp3",
    fact: "Originally from a classic 1983 tactical game, this catchy tune became the theme of early 2008 Roblox cities."
  }
];

export default function RobloxBoombox() {
  const { language } = useLanguage();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [useFallback, setUseFallback] = useState(false);
  const [customAssetInput, setCustomAssetInput] = useState("");
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Synthesized chiptune fallback mechanism
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = SONG_PLAYLIST[currentSongIndex];

  // Sync state with HTML Audio playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Clean play sequence when song swaps
  useEffect(() => {
    stopAllAudio();
    if (isPlaying && !isSynthPlaying) {
      playCurrentStreaming();
    }
  }, [currentSongIndex, useFallback]);

  const stopAllAudio = () => {
    // 1. Clear streaming audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // 2. Clear procedural synth
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    setIsSynthPlaying(false);
  };

  const playCurrentStreaming = () => {
    setAudioError(null);
    if (!audioRef.current) return;

    const baseRawUrl = useFallback ? currentSong.fallbackUrl : currentSong.url;
    // Route through our premium server-side same-origin media audio proxy to erase CORS bans
    const proxiedUrl = `/api/proxy-audio?url=${encodeURIComponent(baseRawUrl)}`;
    audioRef.current.src = proxiedUrl;
    
    // Explicitly configure crossOrigin on the audio element to play nicely with modern browsers
    audioRef.current.crossOrigin = "anonymous";
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Proxy audio playback blocked or network issue occurred, trying fallback stream:", err);
          
          if (!useFallback) {
            // Automatically try alternative fallback stream
            setUseFallback(true);
          } else {
            setAudioError(language === "th" 
              ? "เกิดข้อผิดพลาดในการโหลดไฟล์เสียงภายนอก กรุณาทดลองใช้ 'โหมดสังเคราะห์เสียง 8-บิต' ด้านขวา!" 
              : "HTML5 player network/CORS error bypass. Try clicking the 'Play 8-Bit Tacos Synth' button!"
            );
            setIsPlaying(false);
          }
        });
    }
  };

  // Turn on streaming play/pause
  const handleTogglePlay = () => {
    if (isSynthPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playCurrentStreaming();
    }
  };

  const handleNextSong = () => {
    setUseFallback(false);
    setCurrentSongIndex((prev) => (prev + 1) % SONG_PLAYLIST.length);
  };

  const handlePrevSong = () => {
    setUseFallback(false);
    setCurrentSongIndex((prev) => (prev - 1 + SONG_PLAYLIST.length) % SONG_PLAYLIST.length);
  };

  // PRO 8-BIT PROCEDURAL SYNTHESIZER FOR CORE SONGS
  // Safe from network blocks, CORS blocks, runs offline inside canvas context!
  const playActiveSongSynth = () => {
    stopAllAudio();
    setIsPlaying(false);
    setIsSynthPlaying(true);
    setAudioError(null);

    // Initialize clean context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      setAudioError("Web Audio API not supported on this terminal browser.");
      return;
    }

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    interface SynthNote {
      note: string;
      freq: number;
      duration: number; // in proportion of quarter-note
    }

    // Melodic sequence of "It's Raining Tacos" primary hook
    const tacosMelody: SynthNote[] = [
      // It's raining tacos
      { note: "C4", freq: 261.63, duration: 0.5 },
      { note: "E4", freq: 329.63, duration: 0.5 },
      { note: "G4", freq: 392.00, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 0.5 },
      { note: "G4", freq: 392.00, duration: 1.0 },
      // space
      { note: "REST", freq: 0, duration: 0.5 },
      // From out of the sky
      { note: "F4", freq: 349.23, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 1.0 },

      { note: "REST", freq: 0, duration: 1.0 },
      
      // Tacos
      { note: "C5", freq: 523.25, duration: 0.4 },
      { note: "A4", freq: 440.00, duration: 0.4 },
      { note: "F4", freq: 349.23, duration: 0.8 },
      
      { note: "REST", freq: 0, duration: 0.5 },
      
      // No need to ask why
      { note: "E4", freq: 329.63, duration: 0.5 },
      { note: "G4", freq: 392.00, duration: 0.5 },
      { note: "B4", freq: 493.88, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 1.0 },

      { note: "REST", freq: 0, duration: 1.0 },

      // Just open your mouth
      { note: "C4", freq: 261.63, duration: 0.5 },
      { note: "E4", freq: 329.63, duration: 0.5 },
      { note: "G4", freq: 392.00, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 0.5 },
      { note: "G4", freq: 392.00, duration: 1.0 },

      { note: "REST", freq: 0, duration: 0.5 },

      // And close your eyes
      { note: "F4", freq: 349.23, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 1.0 },

      { note: "REST", freq: 0, duration: 1.5 },

      // It's raining tacos!
      { note: "C5", freq: 523.25, duration: 0.4 },
      { note: "D5", freq: 587.33, duration: 0.4 },
      { note: "E5", freq: 659.25, duration: 0.4 },
      { note: "F5", freq: 698.46, duration: 1.5 }
    ];

    // Melodic sequence of "Wind of Fjords" driving progression
    const windOfFjordsMelody: SynthNote[] = [
      { note: "A4", freq: 440.00, duration: 0.25 },
      { note: "C5", freq: 523.25, duration: 0.25 },
      { note: "E5", freq: 659.25, duration: 0.25 },
      { note: "A5", freq: 880.00, duration: 0.5 },
      { note: "G5", freq: 783.99, duration: 0.25 },
      { note: "E5", freq: 659.25, duration: 0.25 },
      { note: "C5", freq: 523.25, duration: 0.5 },
      
      { note: "D5", freq: 587.33, duration: 0.25 },
      { note: "F5", freq: 698.46, duration: 0.25 },
      { note: "A5", freq: 880.00, duration: 0.5 },
      { note: "G5", freq: 783.99, duration: 0.25 },
      { note: "F5", freq: 698.46, duration: 0.25 },
      { note: "D5", freq: 587.33, duration: 0.5 },

      { note: "C5", freq: 523.25, duration: 0.25 },
      { note: "E5", freq: 659.25, duration: 0.25 },
      { note: "G5", freq: 783.99, duration: 0.5 },
      { note: "F5", freq: 698.46, duration: 0.25 },
      { note: "E5", freq: 659.25, duration: 0.25 },
      { note: "C5", freq: 523.25, duration: 0.5 },

      { note: "B4", freq: 493.88, duration: 0.5 },
      { note: "E5", freq: 659.25, duration: 0.5 },
      { note: "G#5", freq: 830.61, duration: 0.5 },
      { note: "B5", freq: 987.77, duration: 0.5 },
    ];

    // Melodic sequence of "The Great Strategy"
    const greatStrategyMelody: SynthNote[] = [
      { note: "D4", freq: 293.66, duration: 0.5 },
      { note: "F4", freq: 349.23, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 1.0 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "C#5", freq: 554.37, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 1.0 },

      { note: "Bb4", freq: 466.16, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "F5", freq: 698.46, duration: 1.0 },
      { note: "E5", freq: 659.25, duration: 0.5 },
      { note: "C#5", freq: 554.37, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 1.0 },

      { note: "G4", freq: 392.00, duration: 0.5 },
      { note: "Bb4", freq: 466.16, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 1.0 },
      { note: "C#5", freq: 554.37, duration: 0.5 },
      { note: "A4", freq: 440.00, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 1.5 },
    ];

    // Melodic sequence of "Roblox Anthem (2007)"
    const robloxAnthemMelody: SynthNote[] = [
      { note: "G4", freq: 392.00, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 0.5 },
      { note: "E5", freq: 659.25, duration: 1.0 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "E5", freq: 659.25, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 1.5 },

      { note: "A4", freq: 440.00, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "F5", freq: 698.46, duration: 1.0 },
      { note: "E5", freq: 659.25, duration: 0.5 },
      { note: "F5", freq: 698.46, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 1.5 },

      { note: "B4", freq: 493.88, duration: 0.5 },
      { note: "E5", freq: 659.25, duration: 0.5 },
      { note: "G5", freq: 783.99, duration: 1.0 },
      { note: "F#5", freq: 739.99, duration: 0.5 },
      { note: "G5", freq: 783.99, duration: 0.5 },
      { note: "E5", freq: 659.25, duration: 1.5 },
    ];

    // Melodic sequence of "M.U.L.E. Theme"
    const muleThemeMelody: SynthNote[] = [
      { note: "C4", freq: 261.63, duration: 0.25 },
      { note: "E4", freq: 329.63, duration: 0.25 },
      { note: "G4", freq: 392.00, duration: 0.25 },
      { note: "C5", freq: 523.25, duration: 0.5 },
      { note: "Bb4", freq: 466.16, duration: 0.25 },
      { note: "G4", freq: 392.00, duration: 0.25 },
      { note: "F4", freq: 349.23, duration: 0.5 },

      { note: "REST", freq: 0, duration: 0.25 },

      { note: "D4", freq: 293.66, duration: 0.25 },
      { note: "F4", freq: 349.23, duration: 0.25 },
      { note: "A4", freq: 440.00, duration: 0.25 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 0.25 },
      { note: "A4", freq: 440.00, duration: 0.25 },
      { note: "G4", freq: 392.00, duration: 0.5 },

      { note: "REST", freq: 0, duration: 0.25 },

      { note: "C5", freq: 523.25, duration: 0.5 },
      { note: "G4", freq: 392.00, duration: 0.5 },
      { note: "C5", freq: 523.25, duration: 0.5 },
      { note: "D5", freq: 587.33, duration: 0.5 },
      { note: "E5", freq: 659.25, duration: 1.0 },
    ];

    // Pick active melody based on current selected song id
    let activeMelody = tacosMelody;
    let tempoBPM = 120;

    const currentSongId = currentSong.id;
    if (currentSongId === "wind-of-fjords") {
      activeMelody = windOfFjordsMelody;
      tempoBPM = 144; // energetic tempo for crossroads battle
    } else if (currentSongId === "great-strategy") {
      activeMelody = greatStrategyMelody;
      tempoBPM = 110;
    } else if (currentSongId === "roblox-anthem") {
      activeMelody = robloxAnthemMelody;
      tempoBPM = 115;
    } else if (currentSongId === "mule-theme") {
      activeMelody = muleThemeMelody;
      tempoBPM = 132;
    }

    let noteIndex = 0;
    const beatDuration = 60 / tempoBPM; // length of 1 quarter-note in seconds

    const playNextNote = () => {
      if (!ctx || ctx.state === "closed") return;
      if (noteIndex >= activeMelody.length) {
        // Repeat loop
        noteIndex = 0;
      }

      const noteItem = activeMelody[noteIndex];
      const durationInSecs = noteItem.duration * beatDuration;

      if (noteItem.freq > 0) {
        // Build 8-bit oscillator
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 8-bit vintage triangle or square wave sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(noteItem.freq, ctx.currentTime);

        // Retro decay ADSR envelope
        gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationInSecs - 0.05);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationInSecs - 0.02);
      }

      noteIndex++;
      synthTimerRef.current = setTimeout(playNextNote, durationInSecs * 1000);
    };

    playNextNote();
  };

  const stopActiveSongSynth = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsSynthPlaying(false);
  };

  // Roblox Classic Asset ID searcher key pad actions
  const handleKeyPadPress = (num: string) => {
    if (customAssetInput.length < 12) {
      setCustomAssetInput((prev) => prev + num);
    }
  };

  const handleKeyPadClear = () => {
    setCustomAssetInput("");
  };

  const handleKeyPadSubmit = () => {
    const padded = customAssetInput.trim();
    if (!padded) return;

    // Check if it matches any pre-existing songs
    const matched = SONG_PLAYLIST.findIndex((s) => s.assetId === padded);
    if (matched !== -1) {
      setCurrentSongIndex(matched);
      setCustomAssetInput("");
      setAudioError(null);
      setIsPlaying(true);
    } else {
      // Procedurally generate a funny Roblox OOF synthesizer beat block because they typed a random ID!
      setAudioError(language === "th"
        ? `ระเบียนสื่อ #${padded} ไม่พบบนคลังเก็บระบบหลัก กำลังสังเคราะห์จังหวะย้อนยุคของไอดีนี้แทน...`
        : `Media ID #${padded} offline. Proc-generating customized 8-bit synth theme for your code!`
      );
      playProceduralThemeFromId(padded);
    }
  };

  const playProceduralThemeFromId = (idStr: string) => {
    stopAllAudio();
    setIsPlaying(false);
    setIsSynthPlaying(true);

    const ctxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!ctxClass) return;

    const ctx = new ctxClass();
    audioCtxRef.current = ctx;

    // Parse characters of the ID to compile notes
    const digits = idStr.split("").map(num => parseInt(num) || 3);
    let noteIndex = 0;

    const playDigitNote = () => {
      if (!ctx || ctx.state === "closed") return;
      if (noteIndex >= digits.length) {
        noteIndex = 0; // Loop-back
      }

      const digit = digits[noteIndex];
      // Map scale C4 -> D5
      const noteMap = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
      const freq = noteMap[digit % noteMap.length];

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = noteIndex % 3 === 0 ? "sawtooth" : "square"; // true 8-bit sound
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);

      noteIndex++;
      synthTimerRef.current = setTimeout(playDigitNote, 320);
    };

    playDigitNote();
  };

  return (
    <div id="roblox-boombox-widget" className="card-gradient p-5 rounded-xl shadow-2xl border border-neutral-850 relative overflow-hidden flex flex-col justify-between mt-6">
      
      {/* Audio Element */}
      <audio ref={audioRef} loop onEnded={() => handleNextSong()} />

      <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 font-mono text-[9px] tracking-wider px-3 py-1 rounded-bl-lg border-l border-b border-yellow-500/20 uppercase font-bold flex items-center gap-1.5">
        <Disc className={`w-2.5 h-2.5 ${isPlaying || isSynthPlaying ? "animate-spin" : ""}`} />
        <span>Roblox Audio Engine</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-yellow-500 animate-pulse" />
          <h3 className="font-display font-semibold text-lg text-white">
            {language === "th" ? "เครื่องบูมบ็อกซ์วิทยุย้อนยุค Roblox" : "Retro Roblox Boombox Radio"}
          </h3>
        </div>

        <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
          {language === "th"
            ? "เพิ่มความย้อนยุคด้วยการเล่นเพลงในตำนานบนเซิร์ฟเวอร์แบบย้อนกาลเวลา! บูมบ็อกซ์รุ่นนี้รองรับการนำเข้าไอดี หรือระบบเล่นคีย์สังเคราะห์ Procedural Waveform ที่ไม่โดนบล็อกเครือข่ายแน่นอน 100%!"
            : "Blast legendary old-school Roblox tracks while hacking your server database! Equipped with 10s digital asset code pad and a 100% CORS-proof procedural Web Audio 8-bit Chiptune synthesizer!"
          }
        </p>

        {/* Display screen */}
        <div className="bg-[#050505] p-3.5 rounded-lg border border-neutral-900 mb-4 font-mono relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1 z-10 flex-1">
            <div className="text-[10px] text-yellow-500 uppercase tracking-widest font-bold">
              {isPlaying ? "[ STREAMING SOUNDTRACK ]" : isSynthPlaying ? "⚡ [ PROCEDURAL: SYNTH ACTIVE ]" : "⏸️ [ BOOMBOX STANDBY ]"}
            </div>
            
            <div className="text-[13px] font-black text-white truncate max-w-[280px]">
              {isSynthPlaying ? `Synthesized 8-Bit: ${currentSong.title}` : currentSong.title}
            </div>

            <div className="text-[10px] text-neutral-400">
              Composer: <span className="text-neutral-200">{isSynthPlaying ? "8-BIT PROCEDURAL OSC" : currentSong.composer}</span> • Year: {currentSong.year}
            </div>

            <div className="text-[9.5px] text-neutral-500 leading-tight pt-1 border-t border-neutral-900 mt-1 italic line-clamp-2">
              "{currentSong.fact}"
            </div>
          </div>

          {/* Vinyl rotating icon */}
          <div className="w-16 h-16 shrink-0 relative flex items-center justify-center ml-2 hidden sm:flex">
            <div className={`w-14 h-14 rounded-full bg-neutral-950 border-4 border-amber-500/30 flex items-center justify-center relative ${isPlaying || isSynthPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }}>
              <div className="w-6 h-6 rounded-full bg-yellow-500/50 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Error messaging inside workspace */}
        {audioError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-2.5 mb-4 flex items-start gap-2 text-[10px] font-mono leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div>{audioError}</div>
          </div>
        )}

        {/* Control and Volume bars Row */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          {/* Audio stream Controls */}
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-900">
            <button
              onClick={handlePrevSong}
              disabled={isSynthPlaying}
              className="text-xs px-2 py-1 bg-neutral-900 hover:bg-neutral-850 rounded hover:text-white disabled:opacity-30 cursor-pointer"
            >
              ◀ BACK
            </button>
            <button
              onClick={handleTogglePlay}
              className={`p-1.5 rounded-full flex items-center justify-center cursor-pointer ${isPlaying ? "bg-red-600 text-white" : "bg-yellow-500 text-black font-extrabold hover:bg-yellow-400"}`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={handleNextSong}
              disabled={isSynthPlaying}
              className="text-xs px-2 py-1 bg-neutral-900 hover:bg-neutral-850 rounded hover:text-white disabled:opacity-30 cursor-pointer"
            >
              NEXT ▶
            </button>
          </div>

          {/* Volume dial */}
          <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-900 select-none">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-green-500" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 accent-yellow-500 bg-neutral-805 cursor-pointer outline-none"
            />
          </div>
        </div>

        {/* STANDALONE DEDICATED SYNTHESIZER ACTIVATOR BUTTON */}
        <div className="mb-5">
          <button
            onClick={() => {
              if (isSynthPlaying) {
                stopActiveSongSynth();
              } else {
                playActiveSongSynth();
              }
            }}
            className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-all border shadow-lg flex items-center justify-center gap-2.5 ${
              isSynthPlaying 
                ? "bg-amber-600 border-amber-400 text-white shadow-amber-900/35 animate-pulse" 
                : "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400 hover:from-yellow-500/30 hover:to-amber-500/20 hover:text-yellow-300 shadow-neutral-950"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isSynthPlaying ? "animate-spin" : ""}`} />
            {isSynthPlaying ? "Stop 8-Bit Synth 🛑" : `Play 8-Bit ${currentSong.title.split(" ")[0]} Synth 👾`}
          </button>
        </div>

        {/* Dynamic Asset ID Keypad simulation */}
        <div className="border border-neutral-900 rounded-lg p-3 bg-neutral-950/60 font-mono">
          <div className="text-[10px] text-neutral-500 uppercase font-black mb-1.5 flex items-center justify-between">
            <span>Boombox Sound Search ID:</span>
            <span className="text-[8.5px] text-neutral-600 bg-neutral-900 px-1 rounded uppercase">Crossroads Gear spec</span>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter Asset ID: e.g. 142376446"
              value={customAssetInput}
              onChange={(e) => setCustomAssetInput(e.target.value.replace(/\D/g, ""))}
              className="flex-1 bg-black text-xs text-yellow-500 border border-neutral-900 rounded px-2.5 py-1.5 font-mono outline-none tracking-widest placeholder:text-neutral-700"
            />
            <button
              onClick={handleKeyPadSubmit}
              className="px-3 bg-yellow-500 text-black font-extrabold text-xs uppercase hover:bg-yellow-400 rounded cursor-pointer"
            >
              Play ID
            </button>
            <button
              onClick={handleKeyPadClear}
              className="px-2 bg-neutral-900 text-neutral-400 hover:text-white text-xs rounded border border-neutral-850 cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Real simulated Roblox boombox keypad matrix */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 w-full text-center">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPadPress(num)}
                className="py-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900/60 rounded text-[11px] font-bold text-neutral-350 hover:text-white cursor-pointer active:scale-95 transition-all"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCustomAssetInput("142376446")}
              className="col-span-2 py-1 bg-yellow-500/5 hover:bg-yellow-500/15 border border-yellow-500/20 text-yellow-500 text-[9.5px] font-bold rounded truncate cursor-pointer"
              title="Shortcut for It's Raining Tacos"
            >
              🌮 Tacos ID
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
