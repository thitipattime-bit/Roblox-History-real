import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Upload, Download, Check, Loader2, ArrowRight, Image as ImageIcon, RefreshCw, AlertTriangle, User } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useLanguage } from "../lib/LanguageContext";
import { RobloxUser } from "./UserAuth";

interface ImageStudioProps {
  currentUser: RobloxUser | null;
  onUpdateUser: (updatedUser: RobloxUser) => void;
}

export default function ImageStudio({ currentUser, onUpdateUser }: ImageStudioProps) {
  const { language, t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const [themePreset, setThemePreset] = useState("Retro Voxel (2006)");
  
  // Image upload state for Edit/Inpaint
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status & output state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorText, setErrorText] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultDescription, setResultDescription] = useState("");
  const [isSavedAsProfile, setIsSavedAsProfile] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const stepsList = [
    language === "th" ? "กำลังตรวจสอบคลาวด์เกตเวย์..." : "Verifying cloud gateway...",
    language === "th" ? "กำลังดึงเอนจินประติมากรรมบล็อกปี 2007..." : "Retrieving 2007 block physics engine...",
    language === "th" ? "กำลังระบายพื้นผิวสีสันย้อนยุค..." : "Re-assembling classic voxel layouts...",
    language === "th" ? "กำลังสแกนโค้งแสงสว่างและพิกเซลอนาล็อก..." : "Injecting analogue lighting & glow overlays...",
    language === "th" ? "ประมวลการเรนเดอร์ภาพความละเอียดสูงสำเร็จ!" : "Finalizing high-fidelity scene composite!"
  ];

  // Auto step-incrementer simulator for immersion
  useEffect(() => {
    if (!isLoading) return;
    let stepIdx = 0;
    setLoadingStep(stepsList[0]);
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % stepsList.length;
      setLoadingStep(stepsList[stepIdx]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLoading, language]);

  const PROMPT_CHIPS = [
    {
      en: "A retro 2006 blocky Roblox wizard standing on Crossroads map holding a glowing neon fire staff, voxel style.",
      th: "พ่อมดบล็อกสไตล์เหลี่ยม Roblox 2006 ยืนบนแผนที่ Crossroads ถือไม้เท้าไฟมีแสงนีออนเรืองๆ"
    },
    {
      en: "Classic Bacon Hair character escaping a massive falling ball of colorful blocks, 2012 shiny glossy render.",
      th: "ตัวละครผมเบคอนคลาสสิกวิ่งหนีลูกบอลบล็อกหลากสีกำลังตกใส่ เรนเดอร์สไตล์ปี 2012 ผิวมันวาว"
    },
    {
      en: "Work at a Pizza Place retro kitchen with yellow blocky chef throwing a pixel pepperoni pizza into a brick oven.",
      th: "ห้องครัวยุคเก่าของ Work at a Pizza Place มีพ่อครัวตัวเหลืองโยนพิซซ่าเปปเปอโรนีแบบพิกเซลเข้าเตาอบอิฐ"
    },
    {
      en: "Isometric 3D bento render of classic swordfight arena on sky floating islands, beautiful vintage colors.",
      th: "การเรนเดอร์ 3D แบบไอโซเมตริกของสนามรบดาบลอยฟ้าสะท้อนบรรยากาศสีโบราณสดใสคลาสสิก"
    }
  ];

  const handleChipClick = (text: string) => {
    setPrompt(text);
  };

  // Convert File object to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorText(language === "th" ? "ต้องเป็นไฟล์รูปภาพเท่านั้น" : "Only image files are permitted");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        const base64Data = e.target.result.split(",")[1];
        setUploadedImageBase64(base64Data);
        setUploadedFileName(file.name);
        setErrorText("");
      }
    };
    reader.onerror = () => {
      setErrorText(language === "th" ? "ไม่สามารถโหลดไฟล์ภาพได้" : "Failed to load image file");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImageBase64(null);
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Run generation or editing matching the server APIs
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setErrorText("");
    setIsSavedAsProfile(false);

    try {
      const isEditing = !!uploadedImageBase64;
      const endpoint = isEditing ? "/api/gemini/edit-image" : "/api/gemini/generate-image";
      
      // Let's augment prompt based on styled settings for immersive classic artwork
      let augmentedPrompt = prompt;
      if (!isEditing) {
        augmentedPrompt += `, high resolution, in style of ${themePreset}, vivid block elements, clean render, 3d design masterpiece.`;
      }

      const bodyPayload = isEditing
        ? {
            prompt,
            imageBytes: uploadedImageBase64,
            mimeType: "image/png",
          }
        : {
            prompt: augmentedPrompt,
            aspectRatio,
            imageSize,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process visual studio request");
      }

      setResultImage(data.imageUrl);
      setResultDescription(data.description || "Synthesized visual scene complete.");
      setIsSimulated(!!data.isSimulated);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "An exception occurred contacting the server side studio.");
    } finally {
      setIsLoading(false);
    }
  };

  // Support continuous editing cycle: use output image as new input
  const handleSendToEditor = () => {
    if (!resultImage) return;
    const base64Data = resultImage.split(",")[1];
    setUploadedImageBase64(base64Data);
    setUploadedFileName(language === "th" ? "ภาพวาดก่อนหน้า.png" : "previous_generated.png");
    setResultImage(null);
    setPrompt("");
  };

  // Set the generated graphic as the user's permanent profile avatar!
  const handleSaveAsAvatar = async () => {
    if (!resultImage || !currentUser) return;
    
    const updatedUser: RobloxUser = {
      ...currentUser,
      avatarUrl: resultImage,
    };

    try {
      onUpdateUser(updatedUser);
      setIsSavedAsProfile(true);

      // Persist to user's Google synced Firestore if logged in
      if (currentUser.uid) {
        const docRef = doc(db, "users", currentUser.uid);
        await setDoc(
          docRef,
          {
            avatarUrl: resultImage,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Firestore persistence error setting avatar:", err);
    }
  };

  // Helper routine to trigger file download in client secure frame
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `roblox_archives_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:px-6 text-left">
      {/* Title & Banner */}
      <div className="mb-8 border-b border-neutral-900 pb-6">
        <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] tracking-widest font-black uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          {language === "th" ? "พรีเมียม AI ครีเอทีฟ สตูดิโอ" : "PREMIUM AI CREATIVE STUDIO"}
        </div>
        <h2 className="font-display font-black text-2xl md:text-3.5xl text-white uppercase tracking-tight leading-tight">
          {language === "th" ? "ห้องจดหมายเหตุประวัติศาสตร์และสร้างอวตาร AI" : "Historical Visualizer & Avatar Rig Studio"}
        </h2>
        <p className="text-xs md:text-sm text-neutral-400 mt-2 max-w-3xl leading-relaxed">
          {language === "th"
            ? "เข้าถึงขุมพลังประมวลผลสูงของ Gemini 3.1 Flash Image ป้อนคำอธิบายวาดสร้างบรรยากาศสถานที่จำลองยุคคลาสสิกหรืออัปเกรดปรับดัดแปลงภาพตัวละคร Roblox ในสไตล์ศิลปะอดีต อัญเชิญภาพเรนเดอร์ของคุณเป็นอวตารประจำวิชาการซิงค์คลาวด์แบบปลอดภัย"
            : "Deploy high-performance Gemini 3.1 Neural models on-demand. Generate pristine vintage Roblox battlegrounds, voxel scenes, or upload custom images to apply AI inpainting styles. Save your artworks directly as your simulated profile avatar linked to Google Firestore database."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick chip selector */}
          <div className="bg-[#0b0c0d] border border-neutral-900 rounded-xl p-4">
            <h4 className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider mb-2.5">
              💡 {language === "th" ? "แชร์ไอเดียตัวเลือกด่วน" : "RECOMMENDED HISTORICAL PROMPTS"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROMPT_CHIPS.map((chip, idx) => {
                const chipText = language === "th" ? chip.th : chip.en;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chipText)}
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-[10px] text-neutral-300 hover:text-white rounded-lg text-left transition-all leading-relaxed line-clamp-2 cursor-pointer font-sans"
                  >
                    {chipText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Form block */}
          <div id="ai-generation-control-panel" className="card-gradient rounded-xl border border-neutral-800 p-5 space-y-5">
            {/* Image upload zone for AI edit/inpainting */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black leading-none block">
                  📸 {language === "th" ? "ภาพตั้งต้นอ้างอิงเพื่อแก้ไข (เลือกหรือไม่ก็ได้)" : "REFERENCE BASE IMAGE TO EDIT (OPTIONAL)"}
                </label>
                {uploadedImageBase64 && (
                  <button
                    onClick={clearUploadedImage}
                    className="text-[9px] font-mono text-neutral-500 hover:text-red-500 bg-transparent border-0 outline-none cursor-pointer"
                  >
                    [{language === "th" ? "นำออก" : "CLEAR IMAGE"}]
                  </button>
                )}
              </div>

              {uploadedImageBase64 ? (
                <div className="bg-neutral-950 border border-red-950/30 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`data:image/png;base64,${uploadedImageBase64}`}
                      alt="Thumbnail context"
                      className="w-10 h-10 object-cover rounded border border-neutral-800"
                    />
                    <div>
                      <div className="text-[10px] text-green-400 font-mono font-bold leading-none uppercase">
                        ✓ {language === "th" ? "สลับเข้าสู่โหมดแก้ไขภาพด้วย AI" : "ACTIVE IMAGE-TO-IMAGE MODE"}
                      </div>
                      <div className="text-[9px] text-neutral-500 truncate max-w-[200px] sm:max-w-xs mt-1.5 font-mono">
                        {uploadedFileName}
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono bg-neutral-900 text-neutral-400 px-2.5 py-1.5 rounded uppercase font-bold select-none border border-neutral-850">
                    {language === "th" ? "โหลดฟิสิกส์แล้ว" : "CONTEXT LOADED"}
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-6 px-4 bg-neutral-950 border border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-red-650 bg-neutral-950/90"
                      : "border-neutral-850 hover:border-neutral-600 hover:bg-neutral-950/40"
                  }`}
                >
                  <Upload className="w-5 h-5 text-neutral-500 mb-2 animate-bounce" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-extrabold">
                    {language === "th" ? "ลากและวางภาพตรงนี้ หรือคลิกเพื่อค้นหา" : "DRAG & DROP IMAGE HERE OR CLICK TO BROWSE"}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1 font-sans">
                    PNG, JPEG, WebP {language === "th" ? "(แนะนำขนาด 1:1)" : "(1:1 ratio is recommended)"}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Prompt input field */}
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-black">
                ✍️ {language === "th" ? "คำอธิบายภาพรายละเอียดสูง" : "DESCRIPTIVE CREATIVE TEXT PROMPT"}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  uploadedImageBase64
                    ? language === "th"
                      ? "ตัวอย่าง: ใส่หมวกสีส้มและถือดาบทองคู่ใจให้กับอวตารนี้..."
                      : "e.g. Add a shiny orange top hat and make the character hold a solid golden sword..."
                    : language === "th"
                    ? "ตัวอย่าง: บรรยากาศฉาก 2007 Crossroads มีตัวเหลืองยืนหว่านทองคำท่ามกลางพิกเซลเรืองแบนด์..."
                    : "e.g. Vintage 2007 Crossroads scenery with noobs constructing block towers, glowing bright sunshine..."
                }
                className="w-full h-24 bg-neutral-950 border border-neutral-850 focus:border-red-600 focus:outline-none rounded-lg p-3 text-xs text-white leading-relaxed font-semibold focus:ring-1 focus:ring-red-600/30"
              />
            </div>

            {/* Config selectors details (only shown in pure Text-To-Image mode) */}
            {!uploadedImageBase64 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5 font-bold">
                    📐 {language === "th" ? "อัตราส่วนภาพ" : "SCENE ASPECT RATIO"}
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {["1:1", "16:9", "9:16"].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1.5 border font-mono text-[9px] font-bold rounded cursor-pointer ${
                          aspectRatio === ratio
                            ? "bg-red-950/20 border-red-600 text-white"
                            : "bg-neutral-950 border-neutral-900 text-neutral-400 hover:border-neutral-800"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1.5 font-bold">
                    🎨 {language === "th" ? "โทนธีมยุคศิลปะ" : "HISTORICAL STYLE THEME"}
                  </label>
                  <select
                    value={themePreset}
                    onChange={(e) => setThemePreset(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded font-mono text-[10px] text-white p-1.5 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="Retro Voxel (2006)">{language === "th" ? "เรโทร บล็อกเหลี่ยม 2006 (Retro Voxel)" : "Retro Voxel (2006)"}</option>
                    <option value="Legacy Glossy (2012)">{language === "th" ? "เรนเดอร์พลาสติกเงานีออน 2012 (Legacy Glossy)" : "Legacy Glossy (2012)"}</option>
                    <option value="Modern Cinematic Art">{language === "th" ? "ภาพยนตร์ 3D ร่วมสมัย (Modern Cinematic)" : "Modern Cinematic Art"}</option>
                    <option value="Vibrant Isometric Blocky">{language === "th" ? "บล็อกของจิ๋วสไตล์เฉียง (Isometric Block)" : "Vibrant Isometric Blocky"}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorText && (
              <div className="p-3.5 bg-red-950/30 border border-red-900/40 text-red-250 font-mono text-[10px] rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>{language === "th" ? "ข้อเสนอประมวลผลล้มเหลว:" : "Neural System Alert:"}</strong> {errorText}
                </div>
              </div>
            )}

            {/* Submission Action */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 bg-red-650 hover:bg-red-750 disabled:opacity-50 disabled:hover:bg-red-650 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{loadingStep || (language === "th" ? "กำลังเรนเดอร์ประวัติศาสตร์..." : "RETRIEVING VOXELS...")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {uploadedImageBase64
                      ? language === "th"
                        ? "ดัดแปลงตกแต่งรูปภาพนี้ด้วย AI"
                        : "APPLY AI IMAGE COMPOSITION"
                      : language === "th"
                      ? "ประมวลผลวาดภาพเสมือนจริงด้วย AI"
                      : "GENERATE SCENE VISUAL"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Results Showcase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-gradient rounded-xl border border-neutral-800 p-5 flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3.5 mb-4">
                <h4 className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  {language === "th" ? "คลังเก็บประดิษฐ์กรรมฉากจำลอง" : "VISUAL RENDERING CANVAS"}
                </h4>
                {resultImage && (
                  <div className="flex gap-1.5 items-center">
                    {isSimulated && (
                      <span className="text-[8px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-900 px-2 py-0.5 rounded leading-none uppercase select-none animate-pulse">
                        {language === "th" ? "จำลองออฟไลน์" : "LOCAL VECTOR"}
                      </span>
                    )}
                    <span className="text-[8px] font-mono font-bold bg-green-950 text-green-400 border border-green-900 px-2 py-0.5 rounded leading-none uppercase select-none">
                      {language === "th" ? "เรนเดอร์สมบูรณ์" : "COMPLETED"}
                    </span>
                  </div>
                )}
              </div>

              {resultImage ? (
                <div className="space-y-4">
                  {/* Image render box */}
                  <div className="relative group bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[250px]">
                    <img
                      src={resultImage}
                      alt={prompt}
                      className="w-full max-h-[360px] object-contain transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating top controls */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex justify-end gap-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <button
                        onClick={handleDownload}
                        title={t("studio_download") || "Download Image File"}
                        className="p-2 bg-neutral-900/90 hover:bg-red-650 border border-neutral-800 text-white rounded transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description returned or inferred */}
                  <div className="bg-[#090a0a] rounded p-3 border border-neutral-900 font-mono text-[10px] text-neutral-400 leading-relaxed text-left font-sans">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider block font-bold mb-1">
                      📄 {language === "th" ? "ข้อมูลทางจดหมายเหตุของชิ้นภาพ" : "ARCHIVAL SCHEMATIC SPECIFICATION"}
                    </span>
                    {resultDescription || (language === "th" ? "ประกอบรูปร่างอ้างอิงจากแบบจำลองฟิสิกส์ประวัติศาสตร์ 2007" : "Voxel asset synthesized with clean texture mapping templates.")}
                  </div>

                  {isSimulated && (
                    <div className="p-3.5 bg-[#17140e] border border-amber-900/30 rounded-lg text-left">
                      <p className="text-[10.5px] text-amber-200/90 leading-relaxed font-sans">
                        ⚠️ <strong>{language === "th" ? "โหมดแซนด์บอกซ์สแตนด์อโลน:" : "Local Sandbox Vector Engine Active:"}</strong>{" "}
                        {language === "th"
                          ? "เนื่องจากโควตาประมวลผลเซิร์ฟเวอร์หลักของเครือข่ายจำกัดชั่วคราว ระบบได้เปิดพอร์ตรีเทรนเวกเตอร์คลาสสิก Roblox บนเว็บบราวเซอร์ของคุณเพื่อประดับอุปกรณ์อวตารอย่างสมบูรณ์แบบโดยไม่ต้องหยุดชะงัก"
                          : "Because the server's global Gemini image generation quota is temporarily throttled or inactive, we've engaged our classic retro-asset generator to assemble beautifully styled vintage layouts on-the-fly. You can still set it as your live profile avatar!"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-neutral-950 border border-dashed border-neutral-900 rounded-lg py-20 px-4 text-center flex flex-col items-center justify-center text-neutral-600 min-h-[300px]">
                  {isLoading ? (
                    <div className="space-y-4 flex flex-col items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-12 h-12 border-4 border-red-650/10 border-t-red-650 rounded-full animate-spin"></div>
                        <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest animate-pulse font-bold mt-2">
                        {language === "th" ? "กำลังปลุกเอนจิน AI คลาวด์..." : "CONSTRUCTING HISTORICAL CANVAS..."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-neutral-800 mb-3" />
                      <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest leading-relaxed max-w-[200px] font-bold">
                        {language === "th" ? "ป้อนคำอธิบายทางด้านซ้ายเพื่อเรนเดอร์ภาพ" : "AWAITING ENGINE SIGNAL REQUESTS"}
                      </p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-1 font-sans">
                        {language === "th" ? "ภาพที่สร้างจะแสดงตรงหน้าจอนี้ทันที" : "Generated results appear in high fidelity render here."}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Actions panel only visible when result exists */}
            {resultImage && currentUser && (
              <div className="space-y-2.5 pt-4 border-t border-neutral-900 mt-4">
                <button
                  onClick={handleSaveAsAvatar}
                  disabled={isSavedAsProfile}
                  className={`w-full py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isSavedAsProfile
                      ? "bg-green-950/30 border border-green-800 text-green-400"
                      : "bg-[#111213] hover:bg-[#18191a] border border-neutral-850 text-neutral-100 hover:border-red-650"
                  }`}
                >
                  {isSavedAsProfile ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === "th" ? "บันทึกเข้าสู่ข้อมูลโปรไฟล์ประวัติชีวิตคลาวด์แล้ว!" : "SAVED AS PROFILE ARCHETYPE!"}</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{language === "th" ? "จัดใช้คุณเป็นอวตารจำลองหลัก" : "SET AS CLOUD PROFILE AVATAR"}</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleSendToEditor}
                    className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-[10px] text-neutral-400 hover:text-white font-mono font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{language === "th" ? "ส่งตกแต่งแก้ไขต่อ" : "CONTINUE EDITING"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-[10px] text-neutral-400 hover:text-white font-mono font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>{language === "th" ? "โหลดรูป" : "DOWNLOAD"}</span>
                  </button>
                </div>
              </div>
            )}

            {resultImage && !currentUser && (
              <div className="bg-red-950/10 border border-red-950/40 rounded p-2.5 text-[9px] text-neutral-400 font-mono leading-relaxed mt-4">
                🔒 {language === "th" ? "คำร้องเตือน: กรุณาลงชื่อเข้าใช้ประวัติศาสตรหอกลางด้านขวาบน เพื่อใช้รูปภาพนี้ลิงก์เก็บเป็นอวตารหลักแบบถาวรได้!" : "Archive Security Constraint: Please sign in to save this AI visual as your cloud-synced avatar."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
